import { AudioAlias, AudioMng } from "@/audio/AudioMng";
import { MyContainer } from "./MyContainer";
import { MyImage } from "./MyImage";

export type MyBtnParams = {
    texture?: string,
    frame?: string,
    frameOn?: string,
    frameDisabled?: string,
    size?: {
        w: number,
        h?: number
    },
    interactivePos?: {
        x: integer,
        y: integer,
    },
    scale?: number,
    hoverScaleFactor?: number,
    isHoverAnim?: boolean,
    clickScale?: boolean,
    audioClickAlias?: string,
    onClick?: Function,
    context?: any
}

const DEFAULT: MyBtnParams = {
    texture: '',
    scale: 1,
    isHoverAnim: true,
    hoverScaleFactor: 1.1,
    clickScale: true,
    audioClickAlias: AudioAlias.Click
}

export enum MyBtnEvent {
    Click = 'Click'
}

export class MyButton extends MyContainer {

    private _params: MyBtnParams;
    protected _dummy: MyContainer;
    protected _img: MyImage;
    private _overDur = 200;
    private _tweenOver: Phaser.Tweens.Tween;
    private _isOver = false;
    private _isDown = false;
    private _disabled = false;

    constructor(scene, x, y, aParams: MyBtnParams) {
        super(scene, x, y);

        this._params = aParams;

        for (const key in DEFAULT) {
            const defaultValue = DEFAULT[key];
            if (this._params[key] == undefined) this._params[key] = defaultValue;
        }

        this._dummy = new MyContainer(scene, 0, 0);
        this._dummy.scale = .01;
        this.add(this._dummy);

        if (this._params.texture) {
            this._img = new MyImage(scene, 0, 0, this._params.texture, this._params.frame);
            this._dummy.add(this._img);
        }

        if (!this._params.size) {
            this._params.size = {
                w: 0
            }
            if (this._img) {
                this._params.size = {
                    w: this._img.width * this._params.scale,
                    h: this._img.height * this._params.scale
                }
            }
        }
        if (!this._params.size.h) this._params.size.h = this._params.size.w;

        const size = this._params.size;
        const pos = this._params.interactivePos ? this._params.interactivePos : { x: 0, y: 0 };
        // this.setSize(size.w, size.h);
        this.setInteractive({
            hitArea: new Phaser.Geom.Rectangle(-size.w / 2 + pos.x, -size.h / 2 + pos.y, size.w, size.h),
            hitAreaCallback: Phaser.Geom.Rectangle.Contains,
            useHandCursor: true
        });

        this.on(Phaser.Input.Events.POINTER_OVER, this.onPointerOver, this);
        this.on(Phaser.Input.Events.POINTER_OUT, this.onPointerOut, this);
        this.on(Phaser.Input.Events.POINTER_DOWN, this.onPointerDown, this);
        this.on(Phaser.Input.Events.POINTER_UP, this.onPointerUp, this);
        this.on(MyBtnEvent.Click, this.onClick, this);

        this.scene.tweens.add({
            targets: this._dummy,
            scale: this._params.scale,
            duration: 200,
            ease: 'Circ.Out'
        });

    }

    private overAnim() {
        if (this._tweenOver) this._tweenOver.stop();
        this._tweenOver = this.scene.tweens.add({
            targets: this._dummy,
            scale: this._params.scale * this._params.hoverScaleFactor,
            duration: this._overDur,
            ease: Phaser.Math.Easing.Back.Out
            // ease: Phaser.Math.Easing.Sine.Out
        })
    }

    private outAnim() {
        if (this._tweenOver) this._tweenOver.stop();
        this._tweenOver = this.scene.tweens.add({
            targets: this._dummy,
            scale: this._params.scale,
            duration: this._overDur,
            ease: Phaser.Math.Easing.Sine.Out
        })
    }

    private onPointerOver() {
        if (this._isOver) return;
        this._isOver = true;
        if (this._params.isHoverAnim) this.overAnim();
    }

    private onPointerOut() {
        if (!this._isOver) return;
        this._isOver = false;
        this._isDown = false;
        if (this._params.isHoverAnim) this.outAnim();
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

    private onClick() {
        if (this._params.onClick) {
            this._params.onClick.call(this._params.context, this);
        }
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

    setClickListener(aCb: Function, aCtx: any) {
        this._params.onClick = aCb;
        this._params.context = aCtx;
    }

    setNewScale(aScale: number) {
        this._params.scale = aScale;
        this._dummy.setScale(this._params.scale);
    }


}