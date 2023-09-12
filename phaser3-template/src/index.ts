import * as Phaser from "phaser";
import { Config } from "./data/Config";
import { Params } from "./data/Params";
import { BootScene } from "./scenes/BootScene";
import { GameScene } from "./scenes/GameScene";
import { PreloaderScene } from "./scenes/PreloaderScene";
import { MenuScene } from "./scenes/MenuScene";
import { FrontEvents } from "./events/FrontEvents";
// @ts-ignore
// import "phaser/plugins/spine/dist/SpinePlugin";
// @ts-ignore
// import { SpineFile } from 'phaser/types/SpineFile';
// @ts-ignore
// import { SpineGameObject } from 'phaser/types/SpineGameObject';
// @ts-ignore
// import { SpinePlugin } from 'phaser/types/SpinePlugin';
import "./_html/css/main.css";

let isLand = true;

function startGame(aGameParams: {
    parent: HTMLElement
}) {
    new Phaser.Game({
        type: Phaser.AUTO,
        parent: aGameParams.parent,
        backgroundColor: 0x222222,
        transparent: true,
        //*
        scale: {
            mode: Phaser.Scale.HEIGHT_CONTROLS_WIDTH,
            autoCenter: Phaser.Scale.CENTER_BOTH,
            width: Config.GW,
            height: Config.GH
        },
        // plugins: {
            // scene: [{ key: 'SpinePlugin', plugin: window['SpinePlugin'], mapping: 'spine' }]
        // },
        scene: [BootScene, PreloaderScene, MenuScene, GameScene],
    });
}

function windowResizeCalculate() {
    const gw = Config.GW;
    const gh = Config.GH;
    const ww = window.innerWidth;
    const wh = window.innerHeight;
    const scale = wh / gh; // scale by height
    Params.gameWidth = Math.min(gw, ww / scale);
}

function checkOrientation() {
    const rotClassName = 'rotate-image-container';
    const imgId = 'rotate__image';
    const ar = 600 / 600;
    const ww = window.innerWidth;
    const wh = window.innerHeight;

    if (isLand && ww / wh < ar) {

        // LogMng.debug('show rotate img');
        isLand = false;
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
            img.src = './assets/images/rotate-phone-icon-white.png';
            divRotate.appendChild(img);
        }

    }
    else if (!isLand && ww / wh >= ar) {
        // LogMng.debug('hide rotate img');
        isLand = true;
        let divGame = document.getElementById('game');
        let divRotate = document.getElementsByClassName(rotClassName)[0] as any;
        divGame.style.display = 'flex';
        divRotate.style.display = 'none';
    }
}

window.addEventListener('resize', () => {
    checkOrientation();
    windowResizeCalculate();
    FrontEvents.getInstance().emit(FrontEvents.EVENT_WINDOW_RESIZE);
}, false);

window.addEventListener('load', () => {

    const gameContainerId = 'game';
    let gameContainer = document.getElementById(gameContainerId);
    if (!gameContainer) {
        let error = `ERROR: game container ${gameContainerId} not found!`;
        alert(error);
        throw error;
    }
    else {
        checkOrientation();
        windowResizeCalculate();
        startGame({ parent: gameContainer });
    }

}, false);