import { LogMng } from "../utils/LogMng";
import { MyMath } from "../utils/MyMath";

// aliases
export enum AudioAlias {
  Click = 'Click',
}

// loading sounds
export const AUDIO_LOAD_DATA = [
  { alias: AudioAlias.Click, file: 'click.mp3' },
];

interface MusicEntry {
  name: string;
  mus: Phaser.Sound.BaseSound;
}

export class AudioMng {

  // local params
  private static readonly MUS_MAX_VOL = 1.0;
  private static musics: MusicEntry[] = [];
  private static enabled = true;

  // global vars — set via AudioMng.scene = this inside CurtainScene.create()
  static scene: Phaser.Scene | null = null;

  private static getScene(): Phaser.Scene {
    if (!AudioMng.scene) throw new Error('AudioMng: scene not initialized. Set AudioMng.scene first.');
    return AudioMng.scene;
  }

  static getMusic(aName: string): Phaser.Sound.BaseSound | null {
    for (let i = 0; i < AudioMng.musics.length; i++) {
      const data = AudioMng.musics[i];
      if (data.name === aName)
        return data.mus;
    }
    return null;
  }

  static getSoundFileByName(aAlias: string): string {
    for (let i = 0; i < AUDIO_LOAD_DATA.length; i++) {
      const element = AUDIO_LOAD_DATA[i];
      if (element.alias === aAlias) return element.file;
    }
    return '';
  }

  static changeMusicVol(aName: string, aVol: number, aTweenScene: Phaser.Scene, aDuration = 500) {
    if (aVol > AudioMng.MUS_MAX_VOL) aVol = AudioMng.MUS_MAX_VOL;
    for (let i = 0; i < AudioMng.musics.length; i++) {
      const data = AudioMng.musics[i];
      if (data.name === aName) {
        const music = data.mus as Phaser.Sound.WebAudioSound | Phaser.Sound.HTML5AudioSound;
        const twObj = { val: music.volume };
        aTweenScene.tweens.add({
          targets: twObj,
          val: aVol,
          duration: aDuration,
          ease: Phaser.Math.Easing.Linear,
          onUpdate: () => {
            music.volume = twObj.val;
          }
        });
      }
    }
  }

  static stopMusicById(id: number, _aVol: number = 0, aDuration: number = 500) {
    try {
      const scene = AudioMng.getScene();
      const data = AudioMng.musics[id];
      const music = data.mus as Phaser.Sound.WebAudioSound | Phaser.Sound.HTML5AudioSound;
      const volFrom = music.volume;

      const twObj = { t: 1 };
      scene.tweens.add({
        targets: twObj,
        t: 0,
        duration: aDuration,
        ease: "Linear.None",
        callbackScope: this,
        onUpdate: () => {
          const vol = volFrom * twObj.t;
          music.setVolume(vol);
        },
        onComplete: () => {
          music.stop();
          AudioMng.musics.splice(id, 1);
        }
      });
    } catch (e) {
      LogMng.error('AudioMng.stopMusicById: ' + e);
    }
  }

  static stopMusicByName(aName: string, aVol: number = 0, aDuration: number = 500) {
    for (let i = AudioMng.musics.length - 1; i >= 0; i--) {
      const data = AudioMng.musics[i];
      if (data.name === aName) {
        AudioMng.stopMusicById(i, aVol, aDuration);
      }
    }
  }

  static stopAllMusic(_aVol: number = 0, _aDuration: number = 500) {
    for (let i = AudioMng.musics.length - 1; i >= 0; i--) {
      AudioMng.stopMusicById(i);
    }
  }

  static setEnabled(aEnabled: boolean) {
    AudioMng.enabled = aEnabled;
    if (AudioMng.enabled) {
      //fadeInMusic();
    }
    else {
      AudioMng.stopAllMusic();
    }
  }

  static getEnabled(): boolean {
    return AudioMng.enabled;
  }

  static playMusic(aName: string, aVolFrom = 0, aVolEnd = 1, aDuration: number = 500) {
    if (!AudioMng.enabled) return;
    const scene = AudioMng.getScene();
    if (aVolEnd > AudioMng.MUS_MAX_VOL) aVolEnd = AudioMng.MUS_MAX_VOL;
    const music = scene.sound.add(aName, {
      volume: aVolFrom,
      loop: true
    }) as Phaser.Sound.WebAudioSound | Phaser.Sound.HTML5AudioSound;
    music.play();
    const twObj = { t: 0 };
    scene.tweens.add({
      targets: twObj,
      t: 1,
      duration: aDuration,
      ease: Phaser.Math.Easing.Linear,
      callbackScope: AudioMng,
      onUpdate: () => {
        const vol = aVolFrom + (aVolEnd - aVolFrom) * twObj.t;
        music.setVolume(vol);
      }
    });
    AudioMng.musics.push({ name: aName, mus: music });
  }

  static playSfx(aName: string, aVol = 1, aDelay = 0): Phaser.Sound.BaseSound | undefined {
    if (!AudioMng.enabled) return undefined;
    const scene = AudioMng.getScene();
    const snd = scene.sound.add(aName, { volume: aVol });
    if (aDelay > 0) {
      setTimeout(() => { snd.play(); }, aDelay);
    } else {
      snd.play();
    }
    return snd;
  }

  static playRandomSfx(aNames: string[], aVol = 1): Phaser.Sound.BaseSound | undefined {
    if (!AudioMng.enabled) return undefined;
    const name = aNames[MyMath.randomIntInRange(0, aNames.length - 1)];
    return AudioMng.playSfx(name, aVol);
  }

  static update(_dt: number) {

  }

}
