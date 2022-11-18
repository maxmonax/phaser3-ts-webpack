import { Config } from "../data/Config";
import { GameEvents } from "../events/GameEvents";

export class MenuScene extends Phaser.Scene {

    private dummyMain: Phaser.GameObjects.Container;

    // GUI
    private btnClose: Phaser.GameObjects.Image;
    private blackCurtain: Phaser.GameObjects.Graphics;

    // flags
    private isPointerDown = false;
    
    private music: Phaser.Sound.BaseSound;

    // resize logic
    private inner_gw = 0;


    constructor() {
        super('MenuScene');
    }

    public init(aData: any) {

    }

    public preload(): void {
        this.load.audio('btn', ['./assets/audio/btn.mp3']);
        this.load.audio('music', ['./assets/audio/music.mp3']);

    }

    public create(): void {
        this.dummyMain = this.add.container(0, 0);

        let bg = this.add.image(Config.GW_HALF, Config.GH_HALF, 'back1');
        this.dummyMain.add(bg);

        this.btnClose = new Phaser.GameObjects.Image(this, 0, 80, 'game', 'btnClose');
        this.btnClose.setInteractive({ cursor: 'pointer' });
        this.updateBtnClosePos();
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

        this.input.on('pointerdown', this.onPointerDown, this);
        this.input.on('pointermove', this.onPointerMove, this);
        this.input.on('pointerup', this.onPointerUp, this);
        
        this.input.on('dragstart', this.onDragStart, this);
        this.input.on('drag', this.onDrag, this);
        this.input.on('dragend', this.onDragEnd, this);

        this.events.once('shutdown', this.shutdown, this);

        this.scale.on('resize', this.onResize, this);
        this.onResize();
    }

    private onResize(gameSize?, baseSize?, displaySize?, resolution?) {
        const gw = Config.GW;
        const gh = Config.GH;
        const ww = window.innerWidth;
        const wh = window.innerHeight;
        const scale = wh / gh;
        this.inner_gw = Math.min(gw, ww / scale);
        // console.log(`size:`, {
        //     ww: ww,
        //     wh: wh,
        //     scale: scale,
        //     inner_gw: this.inner_gw
        // });

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
            this.btnClose.x = (Config.GW - this.inner_gw) / 2 + 80;
        }
    }

    private onPointerDown(aPointer, aObj) {
        this.isPointerDown = true;

        if (aObj[0] == this.btnClose) {
            this.sound.play('btn');
            this.btnClose['isMouseDown'] = true;
        }

    }

    private onPointerUp(aPointer, aObj) {
        
        if (this.btnClose) {
            if (aObj[0] == this.btnClose && this.btnClose['isMouseDown']) {
                this.onCloseClick();
            }
            this.btnClose['isMouseDown'] = false;
        }

        this.isPointerDown = false;

    }

    private onPointerMove(aPointer) {
        if (!this.isPointerDown) return;
    }

    private onDragStart(aPointer, aObj) {

    }

    private onDrag(aPointer, aObj, dragX, dragY) {

    }

    private onDragEnd(aPointer, aObj) {

    }

    private onCloseClick() {
        GameEvents.getInstance().closeClick();
    }

    private shutdown() {

    }

    update(allTime: number, dt: number) {
        
    }

}