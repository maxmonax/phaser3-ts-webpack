import { Config } from "../data/Config";
import { Params } from "../data/Params";
import { LogMng } from "../utils/LogMng";

export class GameScene extends Phaser.Scene {
    
    // GUI
    private btnBack: Phaser.GameObjects.Image;
    private blackCurtain: Phaser.GameObjects.Graphics;

    // for resize
    private inner_gw = 0;



    constructor() {
        super({ key: 'GameScene' });
    }

    public init(aData: any) {

    }

    public preload(): void {

        this.load.audio('btn', ['./assets/audio/btn.mp3']);

        this.scale.on('resize', this.onResize, this);
        this.onResize();

    }

    public create(): void {

        let bg = this.add.image(Config.GW_HALF, Config.GH_HALF, 'back1');
        this.add.existing(bg);

        this.btnBack = new Phaser.GameObjects.Image(this, 0, 80, 'game', 'btnBack');
        this.btnBack.setInteractive({ cursor: 'pointer' });
        this.updateBtnBackPos();
        this.add.existing(this.btnBack);

        let scoreText = new Phaser.GameObjects.Text(this, 0, 160, 'Game Screen, custom google font', {
            fontFamily: 'DynaPuff',
            color: '#4d81e8',
            align: 'center'
        });
        scoreText.setFontSize(260);
        scoreText.setOrigin(0.5, 0.5);
        this.add.existing(scoreText);

        this.blackCurtain = this.add.graphics();
        this.blackCurtain.fillStyle(0x111111);
        this.blackCurtain.fillRect(0, 0, Config.GW, Config.GH);
        this.hideBlackCurtain();

        this.input.on('pointerdown', this.onPointerDown, this);
        this.input.on('pointermove', this.onPointerMove, this);
        this.input.on('pointerup', this.onPointerUp, this);

        this.input.on('dragstart', this.onDragStart, this);
        this.input.on('drag', this.onDrag, this);
        this.input.on('dragend', this.onDragEnd, this);
        
        

    }

    private onResize(gameSize?, baseSize?, displaySize?, resolution?) {
        const gw = Config.GW;
        const gh = Config.GH;
        const ww = window.innerWidth;
        const wh = window.innerHeight;
        const scale = wh / gh;
        this.inner_gw = Math.min(gw, ww / scale);

        this.updateBtnBackPos();
        // if (this.gameMng) this.gameMng.onResize(this.inner_gw);

        // debug
        // console.log(`size:`, {
        //     ww: ww,
        //     wh: wh,
        //     scale: scale,
        //     inner_gw: this.inner_gw
        // });
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

    private updateBtnBackPos() {
        if (this.btnBack) {
            this.btnBack.x = (Config.GW - this.inner_gw) / 2 + 90;
        }
    }

    private onPointerDown(p, aObj) {
        if (aObj[0] == this.btnBack) {
            this.sound.play('btn');
            this.btnBack['isMouseDown'] = true;
        }
    }

    private onPointerUp(p, aObj) {
        if (this.btnBack) {
            if (aObj[0] == this.btnBack && this.btnBack['isMouseDown']) {
                this.onBackClick();
            }
            this.btnBack['isMouseDown'] = false;
        }
    }

    private onPointerMove(p) {
        
    }

    private onDragStart(pointer, aObj, dragX, dragY) {

    }

    private onDrag(pointer, aObj, dragX, dragY) {
        aObj.x = dragX;
        aObj.y = dragY;
    }

    private onDragEnd(pointer, aObj) {
        LogMng.debug(`obj ${aObj['aliasName']}: ${aObj.x}, ${aObj.y}`);

    }

    private onBackClick() {
        this.showBlackCurtain(() => {
            this.scene.start('MenuScene');
        });
    }

    private getStarPosX(): number {
        const gw = Config.GW;
        return gw - (gw - this.inner_gw) / 2 - 100;
    }
    
    update(allTime: number, dtMs: number) {
        // get dt in Sec
        let dt = dtMs * 0.001;
    }

}