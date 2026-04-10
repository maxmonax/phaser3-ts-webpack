import { Config } from "@/data/Config";
import { MyContainer } from "./basic/MyContainer";
import { MyGraphics } from "./basic/MyGraphics";

export class Curtain extends MyContainer {
    private _curtain: MyGraphics;

    constructor(aParams: {
        scene,
        w: number,
        h: number,
        x?: number,
        y?: number,
        color?: number
    }) {
        super(aParams.scene, aParams.x, aParams.y);

        this._curtain = new MyGraphics(this.scene, {
            fillStyle: {
                color: aParams.color
            },
            lineStyle: {
                alpha: 0
            }
        });

        let size = {
            w: Config.GW,
            h: Config.GH
        }

        this._curtain.fillRect(-size.w / 2, -size.h / 2, size.w, size.h);
        let hitArea = new Phaser.Geom.Rectangle(-size.w / 2, -size.h / 2, size.w, size.h);
        this._curtain.setInteractive(hitArea, Phaser.Geom.Rectangle.Contains);
        this._curtain.visible = false;

        this.add(this._curtain);

    }

    showCurtain(aParams?: {
        dur?: number,
        alpha?: number,
        cb?: Function,
        ctx?: any
    }) {
        let dur = aParams?.dur || 0;
        let alpha = aParams?.alpha || 1;
        let cb = aParams?.cb;
        let ctx = aParams?.ctx;
        
        if (dur > 0) {
            this.scene.tweens.killTweensOf(this._curtain);
            this._curtain.alpha = 0;
            this.scene.tweens.add({
                targets: this._curtain,
                alpha: alpha,
                duration: dur,
                ease: Phaser.Math.Easing.Sine.InOut,
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

    hideCurtain(aDur = 0, aCallback?: Function, aCtx?: any) {
        if (aDur > 0) {
            this.scene.tweens.killTweensOf(this._curtain);
            this.scene.tweens.add({
                targets: this._curtain,
                alpha: 0,
                duration: aDur,
                ease: Phaser.Math.Easing.Sine.InOut,
                onComplete: () => {
                    this._curtain.visible = false;
                    if (aCallback) aCallback.call(aCtx);
                }
            });
        }
        else {
            this._curtain.visible = false;
        }
    }

}