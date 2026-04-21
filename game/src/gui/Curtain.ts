import { MyContainer } from './basic/MyContainer';
import { MyGraphics } from './basic/MyGraphics';

export class Curtain extends MyContainer {
  private _curtain: MyGraphics;

  constructor(aParams: {
    scene: Phaser.Scene;
    w: number;
    h: number;
    x?: number;
    y?: number;
    color?: number;
  }) {
    super(aParams.scene, aParams.x ?? 0, aParams.y ?? 0);

    this._curtain = new MyGraphics(this.scene, {
      fillStyle: {
        color: aParams.color ?? 0x111111,
      },
      lineStyle: {
        alpha: 0,
      },
    });

    const size = {
      w: aParams.w,
      h: aParams.h,
    };

    this._curtain.fillRect(-size.w / 2, -size.h / 2, size.w, size.h);
    const hitArea = new Phaser.Geom.Rectangle(-size.w / 2, -size.h / 2, size.w, size.h);
    this._curtain.setInteractive(hitArea, Phaser.Geom.Rectangle.Contains);
    this._curtain.visible = false;

    this.add(this._curtain);
  }

  private _fadeTo(
    alpha: number,
    duration: number,
    ease: string | ((v: number) => number),
    onStart?: () => void,
    onComplete?: () => void
  ): void {
    if (duration > 0) {
      this.scene.tweens.killTweensOf(this._curtain);
      this.scene.tweens.add({
        targets: this._curtain,
        alpha,
        duration,
        ease,
        onStart,
        onComplete,
      });
    } else {
      onStart?.();
      this._curtain.alpha = alpha;
      onComplete?.();
    }
  }

  showCurtain(aParams?: {
    dur?: number;
    alpha?: number;
    ease?: string | ((v: number) => number);
    cb?: () => void;
    ctx?: object;
  }) {
    const dur = aParams?.dur ?? 0;
    const alpha = aParams?.alpha ?? 1;
    const ease = aParams?.ease ?? Phaser.Math.Easing.Sine.InOut;
    const cb = aParams?.cb;
    const ctx = aParams?.ctx;

    this._curtain.alpha = 0;
    this._fadeTo(
      alpha,
      dur,
      ease,
      () => {
        this._curtain.visible = true;
      },
      () => {
        if (cb) cb.call(ctx);
      }
    );
  }

  hideCurtain(
    aDur = 0,
    aCallback?: () => void,
    aCtx?: object,
    aEase: string | ((v: number) => number) = Phaser.Math.Easing.Sine.InOut
  ) {
    this._fadeTo(0, aDur, aEase, undefined, () => {
      this._curtain.visible = false;
      if (aCallback) aCallback.call(aCtx);
    });
  }
}
