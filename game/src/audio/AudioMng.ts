import { MyMath } from "../utils/MyMath";

export enum AudioAlias {
    Click = "Click",
}

export const AUDIO_LOAD_DATA: ReadonlyArray<{ alias: AudioAlias, file: string }> = [
    { alias: AudioAlias.Click, file: "click.mp3" },
];

type ManagedSound = Phaser.Sound.BaseSound & {
    volume: number;
    setVolume(value: number): ManagedSound;
};

type MusicEntry = {
    key: string;
    sound: ManagedSound;
    baseVolume: number;
    fadeTween?: Phaser.Tweens.Tween;
};

export type PlayMusicOptions = {
    volume?: number;
    fadeDuration?: number;
    fadeFrom?: number;
    loop?: boolean;
    restart?: boolean;
    config?: Phaser.Types.Sound.SoundConfig;
};

export type StopMusicOptions = {
    fadeDuration?: number;
    fadeTo?: number;
    destroy?: boolean;
};

export type PlaySfxOptions = Phaser.Types.Sound.SoundConfig & {
    force?: boolean;
    marker?: string;
};

export class AudioMng {

    private static readonly DEFAULT_MUSIC_FADE = 500;
    private static readonly DEFAULT_MUSIC_VOLUME = 1;
    private static readonly MIN_VOLUME = 0;
    private static readonly MAX_VOLUME = 1;

    private static scene: Phaser.Scene | null = null;
    private static musicEnabled = true;
    private static sfxEnabled = true;
    private static musicVolume = 1;
    private static sfxVolume = 1;
    private static musics = new Map<string, MusicEntry>();
    private static activeSfx = new Map<string, Set<Phaser.Sound.BaseSound>>();

    static init(scene: Phaser.Scene): void {
        AudioMng.scene = scene;
    }

    static getSoundFileByName(alias: string): string {
        return AUDIO_LOAD_DATA.find((item) => item.alias === alias)?.file ?? "";
    }

    static getMusic(name: string): Phaser.Sound.BaseSound | null {
        return AudioMng.musics.get(name)?.sound ?? null;
    }

    static isMusicPlaying(name: string): boolean {
        return AudioMng.musics.get(name)?.sound.isPlaying ?? false;
    }

    static playMusic(name: string, options?: PlayMusicOptions): Phaser.Sound.BaseSound | null;
    static playMusic(name: string, volumeFrom: number, volumeTo?: number, fadeDuration?: number): Phaser.Sound.BaseSound | null;
    static playMusic(
        name: string,
        optionsOrVolumeFrom: PlayMusicOptions | number = {},
        volumeTo = AudioMng.DEFAULT_MUSIC_VOLUME,
        fadeDuration = AudioMng.DEFAULT_MUSIC_FADE
    ): Phaser.Sound.BaseSound | null {
        if (!AudioMng.musicEnabled) return null;

        const scene = AudioMng.getScene();
        const options = AudioMng.normalizeMusicOptions(optionsOrVolumeFrom, volumeTo, fadeDuration);
        const volume = AudioMng.clampVolume(options.volume ?? AudioMng.DEFAULT_MUSIC_VOLUME);
        const fadeFrom = AudioMng.clampVolume(options.fadeFrom ?? 0);
        const fadeMs = Math.max(0, options.fadeDuration ?? AudioMng.DEFAULT_MUSIC_FADE);
        const targetVolume = AudioMng.getEffectiveMusicVolume(volume);
        const startVolume = AudioMng.getEffectiveMusicVolume(fadeFrom);
        const loop = options.loop ?? true;
        const existing = AudioMng.musics.get(name);

        if (existing) {
            existing.baseVolume = volume;
            if (options.restart) {
                existing.sound.stop();
                existing.sound.play({ ...options.config, loop, volume: startVolume });
            }
            else if (!existing.sound.isPlaying) {
                existing.sound.play({ ...options.config, loop, volume: startVolume });
            }
            AudioMng.fadeMusic(existing, targetVolume, fadeMs);
            return existing.sound;
        }

        const sound = scene.sound.add(name, {
            ...options.config,
            loop,
            volume: fadeMs > 0 ? startVolume : targetVolume,
        }) as ManagedSound;

        const entry: MusicEntry = {
            key: name,
            sound,
            baseVolume: volume,
        };

        sound.once(Phaser.Sound.Events.DESTROY, () => AudioMng.removeMusicEntry(name, sound));
        sound.play();
        AudioMng.musics.set(name, entry);

        if (fadeMs > 0 && fadeFrom !== volume) {
            AudioMng.fadeMusic(entry, targetVolume, fadeMs);
        }

        return sound;
    }

    static stopMusic(name: string, options: StopMusicOptions = {}): void {
        const entry = AudioMng.musics.get(name);
        if (!entry) return;

        const fadeMs = Math.max(0, options.fadeDuration ?? AudioMng.DEFAULT_MUSIC_FADE);
        const fadeTo = AudioMng.clampVolume(options.fadeTo ?? 0);
        const destroy = options.destroy ?? true;

        AudioMng.stopMusicEntry(entry, fadeMs, fadeTo, destroy);
    }

    static stopMusicByName(name: string, volume = 0, duration = AudioMng.DEFAULT_MUSIC_FADE): void {
        AudioMng.stopMusic(name, { fadeDuration: duration, fadeTo: volume });
    }

    static stopMusicById(id: number, volume = 0, duration = AudioMng.DEFAULT_MUSIC_FADE): void {
        const entry = Array.from(AudioMng.musics.values())[id];
        if (!entry) return;
        AudioMng.stopMusicEntry(entry, duration, volume, true);
    }

    static stopAllMusic(volume = 0, duration = AudioMng.DEFAULT_MUSIC_FADE): void {
        for (const entry of Array.from(AudioMng.musics.values())) {
            AudioMng.stopMusicEntry(entry, duration, volume, true);
        }
    }

    static changeMusicVol(name: string, volume: number, _tweenScene?: Phaser.Scene, duration = AudioMng.DEFAULT_MUSIC_FADE): void {
        AudioMng.fadeMusicVolume(name, volume, duration);
    }

    static fadeMusicVolume(name: string, volume: number, duration = AudioMng.DEFAULT_MUSIC_FADE): void {
        const entry = AudioMng.musics.get(name);
        if (!entry) return;
        entry.baseVolume = AudioMng.clampVolume(volume);
        AudioMng.fadeMusic(entry, AudioMng.getEffectiveMusicVolume(entry.baseVolume), Math.max(0, duration));
    }

    static setMusicVolume(volume: number, fadeDuration = 0): void {
        AudioMng.musicVolume = AudioMng.clampVolume(volume);
        for (const entry of AudioMng.musics.values()) {
            AudioMng.fadeMusic(entry, AudioMng.getEffectiveMusicVolume(entry.baseVolume), Math.max(0, fadeDuration));
        }
    }

    static getMusicVolume(): number {
        return AudioMng.musicVolume;
    }

    static setSfxVolume(volume: number): void {
        AudioMng.sfxVolume = AudioMng.clampVolume(volume);
    }

    static getSfxVolume(): number {
        return AudioMng.sfxVolume;
    }

    static setMusicEnabled(enabled: boolean, fadeDuration = AudioMng.DEFAULT_MUSIC_FADE): void {
        AudioMng.musicEnabled = enabled;
        if (!enabled) {
            AudioMng.stopAllMusic(0, fadeDuration);
        }
    }

    static getMusicEnabled(): boolean {
        return AudioMng.musicEnabled;
    }

    static setSfxEnabled(enabled: boolean): void {
        AudioMng.sfxEnabled = enabled;
        if (!enabled) {
            AudioMng.stopAllSfx();
        }
    }

    static getSfxEnabled(): boolean {
        return AudioMng.sfxEnabled;
    }

    static setEnabled(enabled: boolean): void {
        AudioMng.setMusicEnabled(enabled);
        AudioMng.setSfxEnabled(enabled);
    }

    static getEnabled(): boolean {
        return AudioMng.musicEnabled && AudioMng.sfxEnabled;
    }

    static playSfx(name: string, volume = 1, delay = 0, force = false): Phaser.Sound.BaseSound | undefined {
        return AudioMng.playSfxEx(name, { volume, delay: delay / 1000, force });
    }

    static playSfxEx(name: string, options: PlaySfxOptions = {}): Phaser.Sound.BaseSound | undefined {
        if (!AudioMng.sfxEnabled) return undefined;
        if (!options.force && AudioMng.isSfxPlaying(name)) return undefined;

        const scene = AudioMng.getScene();
        const { force: _force, marker, ...config } = options;
        const sfxConfig = {
            ...config,
            volume: AudioMng.clampVolume((config.volume ?? 1) * AudioMng.sfxVolume),
        };
        const sound = scene.sound.add(name, sfxConfig);
        AudioMng.registerSfx(name, sound);

        const isStarted = marker ? sound.play(marker, sfxConfig) : sound.play(sfxConfig);
        if (!isStarted) {
            AudioMng.unregisterSfx(name, sound);
            sound.destroy();
            return undefined;
        }

        return sound;
    }

    static playSfxForced(name: string, volume = 1, delay = 0): Phaser.Sound.BaseSound | undefined {
        return AudioMng.playSfx(name, volume, delay, true);
    }

    static playRandomSfx(names: string[], volume = 1, force = false): Phaser.Sound.BaseSound | undefined {
        if (names.length === 0) return undefined;
        const name = names[MyMath.randomIntInRange(0, names.length - 1)];
        return AudioMng.playSfx(name, volume, 0, force);
    }

    static isSfxPlaying(name: string): boolean {
        const sounds = AudioMng.activeSfx.get(name);
        if (!sounds) return false;

        return sounds.size > 0;
    }

    static stopSfx(name: string): void {
        const sounds = AudioMng.activeSfx.get(name);
        if (!sounds) return;

        for (const sound of Array.from(sounds)) {
            sound.stop();
        }
    }

    static stopAllSfx(): void {
        for (const sounds of AudioMng.activeSfx.values()) {
            for (const sound of Array.from(sounds)) {
                sound.stop();
            }
        }
    }

    static update(_dt: number): void {
    }

    private static getScene(): Phaser.Scene {
        if (!AudioMng.scene) {
            throw new Error("AudioMng: call AudioMng.init(scene) before using sounds.");
        }
        return AudioMng.scene;
    }

    private static normalizeMusicOptions(
        optionsOrVolumeFrom: PlayMusicOptions | number,
        volumeTo: number,
        fadeDuration: number
    ): PlayMusicOptions {
        if (typeof optionsOrVolumeFrom === "number") {
            return {
                fadeFrom: optionsOrVolumeFrom,
                volume: volumeTo,
                fadeDuration,
            };
        }

        return optionsOrVolumeFrom;
    }

    private static fadeMusic(entry: MusicEntry, volume: number, duration: number, onComplete?: () => void): void {
        const scene = AudioMng.getScene();

        if (entry.fadeTween) {
            entry.fadeTween.stop();
            entry.fadeTween = undefined;
        }

        if (duration <= 0) {
            entry.sound.setVolume(volume);
            onComplete?.();
            return;
        }

        const tweenData = { volume: entry.sound.volume };
        entry.fadeTween = scene.tweens.add({
            targets: tweenData,
            volume,
            duration,
            ease: Phaser.Math.Easing.Linear,
            onUpdate: () => {
                entry.sound.setVolume(tweenData.volume);
            },
            onComplete: () => {
                entry.fadeTween = undefined;
                entry.sound.setVolume(volume);
                onComplete?.();
            },
        });
    }

    private static stopMusicEntry(entry: MusicEntry, fadeDuration: number, fadeTo: number, destroy: boolean): void {
        AudioMng.fadeMusic(entry, AudioMng.getEffectiveMusicVolume(fadeTo), Math.max(0, fadeDuration), () => {
            entry.sound.stop();
            AudioMng.musics.delete(entry.key);
            if (destroy) entry.sound.destroy();
        });
    }

    private static removeMusicEntry(name: string, sound: Phaser.Sound.BaseSound): void {
        const entry = AudioMng.musics.get(name);
        if (entry?.sound === sound) {
            AudioMng.musics.delete(name);
        }
    }

    private static registerSfx(name: string, sound: Phaser.Sound.BaseSound): void {
        let sounds = AudioMng.activeSfx.get(name);
        if (!sounds) {
            sounds = new Set();
            AudioMng.activeSfx.set(name, sounds);
        }

        sounds.add(sound);

        let isCleaned = false;
        const cleanup = () => {
            if (isCleaned) return;
            isCleaned = true;
            AudioMng.unregisterSfx(name, sound);
            sound.destroy();
        };

        sound.once(Phaser.Sound.Events.COMPLETE, cleanup);
        sound.once(Phaser.Sound.Events.STOP, cleanup);
        sound.once(Phaser.Sound.Events.DESTROY, () => AudioMng.unregisterSfx(name, sound));
    }

    private static unregisterSfx(name: string, sound: Phaser.Sound.BaseSound): void {
        const sounds = AudioMng.activeSfx.get(name);
        if (!sounds) return;

        sounds.delete(sound);
        if (sounds.size === 0) {
            AudioMng.activeSfx.delete(name);
        }
    }

    private static clampVolume(value: number): number {
        return Phaser.Math.Clamp(value, AudioMng.MIN_VOLUME, AudioMng.MAX_VOLUME);
    }

    private static getEffectiveMusicVolume(baseVolume: number): number {
        return AudioMng.clampVolume(AudioMng.clampVolume(baseVolume) * AudioMng.musicVolume);
    }

}
