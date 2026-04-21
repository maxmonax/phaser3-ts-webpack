import { Config } from '@/data/Config';
import { Params } from '@/data/Params';

const rotClassName = 'rotate-image-container';
const imgId = 'rotate__image';

export class OrientationAlert {
  private static showOrientationAlert() {
    const divGame = document.getElementById('game');
    const divRotate = document.getElementsByClassName(rotClassName)[0] as HTMLElement;
    if (!divGame) return;
    divGame.style.display = 'none';
    divRotate.style.display = 'flex';
  }

  private static hideOrientationAlert() {
    const divGame = document.getElementById('game');
    const divRotate = document.getElementsByClassName(rotClassName)[0] as HTMLElement;
    if (!divGame) return;
    divGame.style.display = 'flex';
    divRotate.style.display = 'none';
  }

  public static checkOrientation(aForce = false) {
    const ar = Config.ORIENTATION.ar;
    const ww = window.innerWidth;
    const wh = window.innerHeight;
    const isLand = ww / wh >= ar;

    if (aForce) Params.isLandscape = !isLand;

    if (isLand && !Params.isLandscape) {
      if (Config.ORIENTATION.inLandscape) {
        OrientationAlert.hideOrientationAlert();
      } else {
        OrientationAlert.showOrientationAlert();
      }
    } else if (!isLand && Params.isLandscape) {
      if (Config.ORIENTATION.inLandscape) {
        OrientationAlert.showOrientationAlert();
      } else {
        OrientationAlert.hideOrientationAlert();
      }
    }
    Params.isLandscape = isLand;
  }

  public static initOrientation() {
    const ar = Config.ORIENTATION.ar;
    const ww = window.innerWidth;
    const wh = window.innerHeight;
    Params.isLandscape = ww / wh >= ar;

    const img = document.getElementById(imgId) as HTMLImageElement | null;
    if (img && !Config.ORIENTATION.inLandscape) {
      img.style.rotate = '-90deg';
    }
  }
}
