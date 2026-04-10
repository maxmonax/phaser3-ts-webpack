import { Config } from "@/data/Config";
import { Params } from "@/data/Params";

const rotClassName = 'rotate-image-container';
const imgId = 'rotate__image';
const imgSrc = './assets/images/rotate-phone-icon-white.png';

export class OrientationAlert {

    private static showOrientationAlert() {
        let divGame = document.getElementById('game');
        let divRotate = document.getElementsByClassName(rotClassName)[0] as any;
        divGame.style.display = 'none';
        divRotate.style.display = 'flex';

        // Get references to the image and container
        if (!document.getElementById(imgId)) {
            // Create a new Image object
            // LogMng.debug('Create a new Image object');
            var img = new Image();
            img.id = imgId;
            img.alt = 'Rotate device to landscape orientation';
            img.src = imgSrc;
            if (!Config.ORIENTATION.inLandscape) {
                img.style.rotate = '-90deg';
            }
            divRotate.appendChild(img);
        }
    }

    private static hideOrientationAlert() {
        let divGame = document.getElementById('game');
        let divRotate = document.getElementsByClassName(rotClassName)[0] as any;
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
            }
            else {
                OrientationAlert.showOrientationAlert();
            }
        }
        else if (!isLand && Params.isLandscape) {
            if (Config.ORIENTATION.inLandscape) {
                OrientationAlert.showOrientationAlert();
            }
            else {
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
    }

}