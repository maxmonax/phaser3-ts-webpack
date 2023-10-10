import { AudioAlias, AudioMng } from "@/audio/AudioMng";
import { MyContainer } from "./MyContainer";
import { MyImage } from "./MyImage";

export enum MyBtnEvent {
    Click = 'Click'
}

type MyBtnParams = {
    texture: string,
    frame: string,
    frameOn?: string,
    frameDisabled?: string,
    size?: {
        w: number,
        h?: number
    },
    scale?: number,
    overScale?: boolean,
    clickScale?: boolean,
    audioClickAlias?: string,
    onClick?: Function,
    context?: any
}

export class MyBtn extends MyContainer {

    private _params: MyBtnParams;
    private _img: MyImage;
    private _overDur = 200;
    private _tweenOver: Phaser.Tweens.Tween;
    private _isOver = false;
    private _isDown = false;
    private _disabled = false;

    constructor(scene, x, y, aParams: MyBtnParams) {
        super(scene, x, y);

        this._params = aParams;
        if (this._params.scale == undefined) this._params.scale = 1;
        if (this._params.overScale == undefined) this._params.overScale = true;
        if (this._params.clickScale == undefined) this._params.clickScale = true;
        if (this._params.audioClickAlias == undefined) this._params.audioClickAlias = AudioAlias.Click;

        this._img = new MyImage(scene, 0, 0, this._params.texture, this._params.frame);
        
        if (!this._params.size) {
            this._params.size = {
                w: this._img.width,
                h: this._img.height
            }
        }
        if (!this._params.size.h) this._params.size.h = this._params.size.w;

        this._img.scale = this._params.scale;
        this.add(this._img);

        const size = this._params.size;
        this.setInteractive({
            hitArea: new Phaser.Geom.Rectangle(-size.w / 2, -size.h / 2, size.w, size.h),
            hitAreaCallback: Phaser.Geom.Rectangle.Contains,
            useHandCursor: true
        });

        this.on(Phaser.Input.Events.POINTER_OVER, this.onPointerOver, this);
        this.on(Phaser.Input.Events.POINTER_OUT, this.onPointerOut, this);
        this.on(Phaser.Input.Events.POINTER_DOWN, this.onPointerDown, this);
        this.on(Phaser.Input.Events.POINTER_UP, this.onPointerUp, this);

        if (aParams.onClick) {
            this.on(MyBtnEvent.Click, aParams.onClick, aParams.context);
        }

    }

    private overAnim() {
        if (this._tweenOver) this._tweenOver.stop();
        this._tweenOver = this.scene.tweens.add({
            targets: this._img,
            scale: 1.1,
            duration: this._overDur,
            ease: Phaser.Math.Easing.Back.Out
            // ease: Phaser.Math.Easing.Sine.Out
        })
    }

    private outAnim() {
        if (this._tweenOver) this._tweenOver.stop();
        this._tweenOver = this.scene.tweens.add({
            targets: this._img,
            scale: 1,
            duration: this._overDur,
            ease: Phaser.Math.Easing.Sine.Out
        })
    }

    private onPointerOver() {
        if (this._isOver) return;
        this._isOver = true;
        if (this._params.overScale) this.overAnim();
    }
    
    private onPointerOut() {
        if (!this._isOver) return;
        this._isOver = false;
        this._isDown = false;
        if (this._params.overScale) this.outAnim();
    }

    private onPointerDown(p) {
        this._isDown = true;
        if (this._params.clickScale) this.outAnim();
    }

    private onPointerUp(p) {
        if (!this._isDown) return;
        this._isDown = false;
        if (this._params.audioClickAlias) AudioMng.playSfx(this._params.audioClickAlias);
        if (this._params.clickScale) this.overAnim();
        this.emit(MyBtnEvent.Click, this);
    }

    public set disabled(v: boolean) {
        this._disabled = v;
        if (this._disabled) {
            this.disableInteractive();
        }
        else {
            this.setInteractive();
        }
    }


}