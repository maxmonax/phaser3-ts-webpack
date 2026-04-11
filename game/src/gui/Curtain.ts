import { MyContainer } from "./basic/MyContainer";
import { MyGraphics } from "./basic/MyGraphics";

export class Curtain extends MyContainer {
    private _curtain: MyGraphics;

    constructor(aParams: {
        scene: Phaser.Scene,
        w: number,
        h: number,
        x?: number,
        y?: number,
        color?: number
    }) {
        super(aParams.scene, aParams.x ?? 0, aParams.y ?? 0);

        this._curtain = new MyGraphics(this.scene, {
            fillStyle: {
                color: aParams.color ?? 0x111111
            },
            lineStyle: {
                alpha: 0
            }
        });

        let size = {
            w: aParams.w,
            h: aParams.h
        };

        this._curtain.fillRect(-size.w / 2, -size.h / 2, size.w, size.h);
        let hitArea = new Phaser.Geom.Rectangle(-size.w / 2, -size.h / 2, size.w, size.h);
        this._curtain.setInteractive(hitArea, Phaser.Geom.Rectangle.Contains);
        this._curtain.visible = false;

        this.add(this._curtain);

    }

    showCurtain(aParams?: {
        dur?: number,
        alpha?: number,
        ease?: string | ((v: number) => number),
        cb?: () => void,
        ctx?: object
    }) {
        let dur = aParams?.dur ?? 0;
        let alpha = aParams?.alpha ?? 1;
        let ease = aParams?.ease ?? Phaser.Math.Easing.Sine.InOut;
        let cb = aParams?.cb;
        let ctx = aParams?.ctx;
        
        if (dur > 0) {
            this.scene.tweens.killTweensOf(this._curtain);
            this._curtain.alpha = 0;
            this.scene.tweens.add({
                targets: this._curtain,
                alpha: alpha,
                duration: dur,
                ease,
                onStart: () => {
                    this._curtain.visible = true;
                },
                onComplete: () => {
                    if (cb) cb.call(ctx);
                }
            });
        }
        else {
            this._curtain.alpha = alpha;
            this._curtain.visible = true;
            if (cb) cb.call(ctx);

        }
    }

    hideCurtain(aDur = 0, aCallback?: () => void, aCtx?: object, aEase: string | ((v: number) => number) = Phaser.Math.Easing.Sine.InOut) {
        if (aDur > 0) {
            this.scene.tweens.killTweensOf(this._curtain);
            this.scene.tweens.add({
                targets: this._curtain,
                alpha: 0,
                duration: aDur,
                ease: aEase,
                onComplete: () => {
                    this._curtain.visible = false;
                    if (aCallback) aCallback.call(aCtx);
                }
            });
        }
        else {
            this._curtain.visible = false;
            if (aCallback) aCallback.call(aCtx);
        }
    }

}
