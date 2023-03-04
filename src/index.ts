import * as Phaser from "phaser";
import { Config } from "./data/Config";
import { Params } from "./data/Params";
import { BootScene } from "./scenes/BootScene";
import { GameScene } from "./scenes/GameScene";
import { PreloaderScene } from "./scenes/PreloaderScene";
import { MenuScene } from "./scenes/MenuScene";
import { GameInitParams } from "./data/Types";
import { FrontEvents } from "./events/FrontEvents";
// @ts-ignore
// import "phaser/plugins/spine/dist/SpinePlugin";
// @ts-ignore
// import { SpineFile } from 'phaser/types/SpineFile';
// @ts-ignore
// import { SpineGameObject } from 'phaser/types/SpineGameObject';
// @ts-ignore
// import { SpinePlugin } from 'phaser/types/SpinePlugin';
import "./css/main.css";

function startGame(aGameParams: GameInitParams) {

    windowResizeCalculate();

    new Phaser.Game({
        type: Phaser.AUTO,
        parent: aGameParams.parentId,
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

window.addEventListener('load', () => {
    let event = new CustomEvent('gameStarterReady', { detail: { startGameMethod: startGame } });
    window.dispatchEvent(event);
}, false);

window.addEventListener('resize', () => {
    windowResizeCalculate();
    FrontEvents.getInstance().emit(FrontEvents.EVENT_WINDOW_RESIZE);
}, false);