import { Config } from "../data/Config";
import { Params } from "../data/Params";
import { FrontEvents } from "../events/FrontEvents";
import { GameEvents } from "../events/GameEvents";
import { LogMng } from "../utils/LogMng";

export class MenuScene extends Phaser.Scene {

    private dummyMain: Phaser.GameObjects.Container;

    // GUI
    private btnPlay: Phaser.GameObjects.Image;
    private btnClose: Phaser.GameObjects.Image;
    private blackCurtain: Phaser.GameObjects.Graphics;

    // flags
    private isPointerDown = false;
    
    private music: Phaser.Sound.BaseSound;


    constructor() {
        super('MenuScene');
        LogMng.debug(`MenuScene -> constructor()...`);
    }

    public init(aData: any) {
        LogMng.debug(`MenuScene -> init()...`);
    }

    public preload(): void {
        LogMng.debug(`MenuScene -> preload()...`);

        this.load.audio('btn', ['./assets/audio/btn.mp3']);
        this.load.audio('music', ['./assets/audio/music.mp3']);
    }

    public create(): void {
        LogMng.debug(`MenuScene -> create()...`);

        this.dummyMain = this.add.container(0, 0);

        let bg = this.add.image(Config.GW_HALF, Config.GH_HALF, 'bg');
        bg.scaleX = Config.GW / bg.width;
        this.dummyMain.add(bg);

        this.btnPlay = new Phaser.GameObjects.Image(this, Config.GW / 2, Config.GH / 2, 'game', 'btnPlay');
        this.btnPlay.setInteractive({ cursor: 'pointer' });
        this.btnPlay.on('pointerdown', () => {
            this.btnPlay['isPointerDown'] = true;
            this.sound.play('btn');
            LogMng.debug(`btnPlay pointerdown!`);
        });
        this.btnPlay.on('pointerup', () => {
            if (this.btnPlay['isPointerDown'] != true) return;
            this.btnPlay['isPointerDown'] = false;
            this.onPlayBtnClick();
        });
        this.add.existing(this.btnPlay);

        this.btnClose = new Phaser.GameObjects.Image(this, 0, 80, 'game', 'btnClose');
        this.btnClose.setInteractive({ cursor: 'pointer' });
        this.updateBtnClosePos();
        this.btnClose.on('pointerdown', () => {
            this.btnClose['isPointerDown'] = true;
            this.sound.play('btn');
            LogMng.debug(`btnClose pointerdown!`);
        });
        this.btnClose.on('pointerup', () => {
            if (this.btnClose['isPointerDown'] != true) return;
            this.btnClose['isPointerDown'] = false;
            this.onCloseBtnClick();
        });
        this.add.existing(this.btnClose);

        this.blackCurtain = this.add.graphics();
        this.blackCurtain.fillStyle(0x111111);
        this.blackCurtain.fillRect(0, 0, Config.GW, Config.GH);
        this.hideBlackCurtain();
        
        // music
        // if (!Params.music) {
        //     Params.music = this.sound.add('music', { loop: true, volume: .2 });
        //     Params.music.play();
        // }
        // else {
        //     Params.music.volume = .2;
        // }

        this.events.once('shutdown', this.onSceneShutdown, this);

        // this.scale.on('resize', this.onResize, this);
        
        FrontEvents.getInstance().addListener(FrontEvents.EVENT_WINDOW_RESIZE, this.onResize, this);
        this.onResize();
    }

    private onResize() {
        this.updateBtnClosePos();
    }

    private hideBlackCurtain(cb?: Function, ctx?: any) {
        this.tweens.killTweensOf(this.blackCurtain);
        this.tweens.add({
            targets: this.blackCurtain,
            alpha: 0,
            duration: 250,
            onComplete: () => {
                this.blackCurtain.visible = false;
                if (cb) cb.call(ctx);
            }
        });
    }

    private showBlackCurtain(cb?: Function, ctx?: any) {
        this.tweens.killTweensOf(this.blackCurtain);
        this.blackCurtain.alpha = 0;
        this.blackCurtain.visible = true;
        this.tweens.add({
            targets: this.blackCurtain,
            alpha: 1,
            duration: 250,
            onComplete: () => {
                if (cb) cb.call(ctx);
            }
        });
    }

    private updateBtnClosePos() {
        if (this.btnClose) {
            this.btnClose.x = (Config.GW - Params.gameWidth) / 2 + 80;
        }
    }

    private onPlayBtnClick() {
        LogMng.debug(`btnPlay click!`);
        this.scene.start('GameScene');
    }

    private onCloseBtnClick() {
        GameEvents.getInstance().closeClick();
    }

    private onSceneShutdown() {
        LogMng.debug(`MenuScene -> onSceneShutdown()...`);
    }

    update(allTime: number, dtMs: number) {
        // get dt in Sec
        let dt = dtMs * 0.001;
    }

}