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

export class AudioMng {

  // local params
  private static readonly MUS_MAX_VOL = 1.0;
  private static musics: any[] = []; // of { name: str, mus: Phaser.Sound }
  private static enabled = true;

  // global vars
  static scene: Phaser.Scene = null;

  static getMusic(aName: string): any {
    for (var i = 0; i < AudioMng.musics.length; i++) {
      var data = AudioMng.musics[i];
      if (data.name == aName)
        return data.mus;
    }
    return null;
  }

  static getSoundFileByName(aAlias: string): string {
    for (let i = 0; i < AUDIO_LOAD_DATA.length; i++) {
      const element = AUDIO_LOAD_DATA[i];
      if (element.alias == aAlias) return element.file;
    }
    return '';
  }

  static changeMusicVol(aName: string, aVol: number, aTweenScene: Phaser.Scene, aDuration = 500) {
    if (aVol > AudioMng.MUS_MAX_VOL) aVol = AudioMng.MUS_MAX_VOL;
    for (let i = 0; i < AudioMng.musics.length; i++) {
      let data = AudioMng.musics[i];
      if (data.name == aName) {
        let music: any = data.mus;
        let twObj = { val: music.volume };
        aTweenScene.tweens.add({
          targets: twObj,
          val: aVol,
          // targets: music,
          // volume: aVol,
          duration: aDuration,
          ease: Phaser.Math.Easing.Linear,
          // callbackScope: SndMng,
          onUpdate: (atr1) => {
            // let vol = aVolFrom + (aVol - aVolFrom) * twObj.t;
            // music.setVolume(twObj.val);
            music.volume = twObj.val;
          }
        });
      }
    }
  }

  static stopMusicById(id: number, aVol: number = 0, aDuration: number = 500) {
    try {
      let data = AudioMng.musics[id];
      let music = data.mus;
      let volFrom = music.volume;

      let twObj = { t: 1 };
      AudioMng.scene.tweens.add({
        targets: twObj,
        t: 0,
        duration: aDuration,
        ease: "Linear.None",
        callbackScope: this,
        onUpdate: () => {
          let vol = volFrom * twObj.t;
          music.setVolume(vol);
        },
        onComplete: () => {
          music.stop();
          AudioMng.musics.splice(id, 1);
        }
      });
    } catch (e) {
      LogMng.error('SndMng.stopMusicById: ' + e);
    }
  }

  static stopMusicByName(aName: string, aVol: number = 0, aDuration: number = 500) {
    for (let i = AudioMng.musics.length - 1; i >= 0; i--) {
      let data = AudioMng.musics[i];
      if (data.name == aName) {
        AudioMng.stopMusicById(i, aVol, aDuration);
      }
    }
  }

  static stopAllMusic(aVol: number = 0, aDuration: number = 500) {
    for (var i = AudioMng.musics.length - 1; i >= 0; i--) {
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
    if (aVolEnd > AudioMng.MUS_MAX_VOL) aVolEnd = AudioMng.MUS_MAX_VOL;
    // create music
    let music: any = AudioMng.scene.sound.add(aName, {
      volume: aVolFrom,
      loop: true
    });
    music.play();
    let twObj = { t: 0 };
    AudioMng.scene.tweens.add({
      targets: twObj,
      t: 1,
      duration: aDuration,
      ease: Phaser.Math.Easing.Linear,
      callbackScope: AudioMng,
      onUpdate: () => {
        let vol = aVolFrom + (aVolEnd - aVolFrom) * twObj.t;
        music.setVolume(vol);
      }
    });
    AudioMng.musics.push({ name: aName, mus: music });
  }

  static playSfx(aName: string, aVol = 1, aDelay = 0): any {
    if (!AudioMng.enabled) return;
    var snd = AudioMng.scene.sound.add(aName, {
      volume: aVol
    });
    if (aDelay > 0) {
      setTimeout(() => {
        snd.play();
      }, aDelay);
    }
    else {
      snd.play();
    }
    return snd;
  }

  static playRandomSfx(aNames: string[], aVol = 1): any {
    if (!AudioMng.enabled) return;
    let name = aNames[MyMath.randomIntInRange(0, aNames.length - 1)];
    // let snd = game.add.audio(name, aVol);
    // snd.play();
    return null;
  }

  static update(dt: number) {

  }

}