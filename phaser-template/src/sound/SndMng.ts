import { LogMng } from "../utils/LogMng";
import { MyMath } from "../utils/MyMath";

// sounds
export const SND_CLICK = 'SND_CLICK';
export const SND_INTRO = 'SND_INTRO';

// loading sounds
export const LOAD_DATA = [
  { alias: SND_INTRO, file: 'assets/audio/intro.mp3' },
];

export class SndMng {

  // local params
  private static readonly MUS_MAX_VOL = 1.0;

  private static musics: any[] = []; // of { name: str, mus: Phaser.Sound }

  // global vars
  static scene: Phaser.Scene = null;

  // local vars
  private static enabled = true;

	
	static getMusic(aName: string): any  {
    for (var i = 0; i < SndMng.musics.length; i++) {
      var data = SndMng.musics[i];
			if (data.name == aName)
				return data.mus;
		}
		return null;
  }
  
  static getSoundFileByName(aAlias: string): string {
    for (let i = 0; i < LOAD_DATA.length; i++) {
      const element = LOAD_DATA[i];
      if (element.alias == aAlias) return element.file;
    }
    return '';
  }
  
	static playMusic(aName: string, aVolFrom = 0, aVolEnd = 1, aDuration: number = 500) {
    if (!SndMng.enabled) return;
    if (aVolEnd > SndMng.MUS_MAX_VOL) aVolEnd = SndMng.MUS_MAX_VOL;
		// create music
    let music: any = SndMng.scene.sound.add(aName, {
      volume: aVolFrom,
      loop: true
    });
		music.play();
    let twObj = { t: 0 };
    SndMng.scene.tweens.add({
      targets: twObj,
      t: 1,
      duration: aDuration,
      ease: "Linear.None",
      callbackScope: SndMng,
      onUpdate: () => {
        let vol = aVolFrom + (aVolEnd - aVolFrom) * twObj.t;
        music.setVolume(vol);
      },
      onComplete: () => {
      }
    });
		SndMng.musics.push({name: aName, mus: music});
	}

  static changeMusicVol(aName: string, aVol: number, aDuration: number = 500) {
    if (aVol > SndMng.MUS_MAX_VOL) aVol = SndMng.MUS_MAX_VOL;
    for (let i = SndMng.musics.length - 1; i >= 0; i--) {
      let data = SndMng.musics[i];
      if (data.name == aName) {
        let music: any = data.mus;
        //let tw = game.add.tween(music).to({ volume: aVol }, aDuration, Phaser.Easing.Linear.None, true);

      }
    }
  }

  static stopMusicById(id: number, aVol: number = 0, aDuration: number = 500) {
    try {
      let data = SndMng.musics[id];
      let music = data.mus;
      let volFrom = music.volume;

      let twObj = { t: 1 };
      SndMng.scene.tweens.add({
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
          SndMng.musics.splice(id, 1);
        }
      });
    } catch (e) {
      LogMng.error('SndMng.stopMusicById: ' + e);
    }
  }
  
  static stopMusicByName(aName: string, aVol: number = 0, aDuration: number = 500) {
		for (let i = SndMng.musics.length - 1; i >= 0; i--) {
      let data = SndMng.musics[i];
      if (data.name == aName) {
        SndMng.stopMusicById(i, aVol, aDuration);
			}
		}
  }
  
  static stopAllMusic(aVol: number = 0, aDuration: number = 500) {
    for (var i = SndMng.musics.length - 1; i >= 0; i--) {
      SndMng.stopMusicById(i);
		}
	}
	
  static setEnabled(aEnabled: boolean) {
    SndMng.enabled = aEnabled;
    if (SndMng.enabled) {
			//fadeInMusic();
		}
		else {
      SndMng.stopAllMusic();
		}
	}

  static getEnabled(): boolean {
    return SndMng.enabled;
	}

  static sfxPlay(aName: string, aVol = 1, aDelay = 0): any {
    if (!SndMng.enabled) return;
    var snd = SndMng.scene.sound.add(aName, {
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
    if (!SndMng.enabled) return;
    let name = aNames[MyMath.randomIntInRange(0, aNames.length - 1)];
    // let snd = game.add.audio(name, aVol);
    // snd.play();
    return null;
  }

  static getPageSoundAlias(aPageId: number): string {
    return 'page_audio_' + aPageId;
  }
  
  static update(dt: number) {
    
  }

}