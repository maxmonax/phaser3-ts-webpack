import { AudioMng, AudioAlias } from "@/audio/AudioMng";
import { Config } from "../data/Config";
import { FrontEvents } from "../events/FrontEvents";
import { GameEvents } from "../events/GameEvents";
import { CurtainScene } from "./CurtainScene";
import { SceneNames } from "./SceneNames";

export class MenuScene extends CurtainScene {

    private dummyMain: Phaser.GameObjects.Container;
    // GUI
    private btnPlay: Phaser.GameObjects.Image;

    constructor() {
        super(SceneNames.MenuScene);
    }

    public init(aData: any) { }

    public preload(): void { }

    public create(): void {

        AudioMng.scene = this;

        // music example
        // if (!Params.music) {
        //     Params.music = this.sound.add('music', { loop: true, volume: .2 });
        //     Params.music.play();
        // }
        // else {
        //     Params.music.volume = .2;
        // }

        this.dummyMain = this.add.container(0, 0);

        let bg = this.add.image(Config.GW_HALF, Config.GH_HALF, 'bg');
        bg.scaleX = Config.GW / bg.width;
        this.dummyMain.add(bg);

        this.btnPlay = new Phaser.GameObjects.Image(this, Config.GW / 2, Config.GH / 2, 'game', 'btnPlay');
        this.btnPlay.setInteractive({ cursor: 'pointer' });
        this.btnPlay.on('pointerdown', () => {
            this.btnPlay['isPointerDown'] = true;
            AudioMng.playSfx(AudioAlias.Click);
        });
        this.btnPlay.on('pointerup', () => {
            if (this.btnPlay['isPointerDown'] != true) return;
            this.btnPlay['isPointerDown'] = false;
            this.onPlayBtnClick();
        });
        this.add.existing(this.btnPlay);
        
        this.events.once('shutdown', this.onSceneShutdown, this);
        
        FrontEvents.getInstance().addListener(FrontEvents.EVENT_WINDOW_RESIZE, this.onResize, this);
        this.onResize();

        super.create();
    }

    private onResize() {
        this.updateBtnClosePos();
    }

    private updateBtnClosePos() {
        
    }

    private onPlayBtnClick() {
        this.showCurtain(() => {
            this.scene.start('GameScene');
        })
    }

    private onSceneShutdown() {
        this.logDebug(`onSceneShutdown()...`);
    }

    update(allTime: number, dtMs: number) {
        // get dt in Sec
        let dt = dtMs * 0.001;
    }

}