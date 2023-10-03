import { Config } from "../data/Config";
import { ILogger } from "../interfaces/ILogger";
import { LogMng } from "../utils/LogMng";

const SETTINGS = {
    grCurtainDuration: 300,
    imageCurtainDuration: 1000,
    dy: Config.GH_HALF + 120
}

export class CurtainScene extends Phaser.Scene implements ILogger {

    private _sceneName: string;
    private _isGraphicsCurtain = false;
    private _grCurtain: Phaser.GameObjects.Graphics;
    private _curtTop: Phaser.GameObjects.Image;
    private _curtBot: Phaser.GameObjects.Image;
    private _curtLogo: Phaser.GameObjects.Image;

    constructor(aSceneName: string) {
        super(aSceneName);
        this._sceneName = aSceneName;
    }

    public create(aIsGraphicsCurtain = true): void {
        this._isGraphicsCurtain = aIsGraphicsCurtain;
        this.initCurtains();
        this.hideCurtain();
    }

    logDebug(aMsg: string, aData?: any) {
        LogMng.debug(`${this._sceneName}: ${aMsg}`, aData);
    }
    logWarn(aMsg: string, aData?: any) {
        LogMng.warn(`${this._sceneName}: ${aMsg}`, aData);
    }
    logError(aMsg: string, aData?: any) {
        LogMng.error(`${this._sceneName}: ${aMsg}`, aData);
    }

    private initCurtains() {
        if (this._isGraphicsCurtain) {
            this._grCurtain = this.add.graphics();
            this._grCurtain.fillStyle(0x111111);
            this._grCurtain.fillRect(0, 0, Config.GW, Config.GH);
        }
        else {
            // image curtains
            this._curtBot = this.add.image(Config.GW_HALF, Config.GH, 'transBot');
            this._curtBot.setOrigin(.5, 1);
            this._curtTop = this.add.image(Config.GW_HALF, 0, 'transTop');
            this._curtTop.setOrigin(.5, 0);
            this._curtLogo = this.add.image(Config.GW_HALF, Config.GH_HALF, 'game', 'menu/logo');
        }
    }

    protected hideCurtain(cb?: Function, ctx?: any) {
        if (this._isGraphicsCurtain) {
            const dur = SETTINGS.grCurtainDuration;
            this.tweens.killTweensOf(this._grCurtain);
            this.tweens.add({
                targets: this._grCurtain,
                alpha: 0,
                duration: dur,
                onComplete: () => {
                    this._grCurtain.visible = false;
                    if (cb) cb.call(ctx);
                }
            });
        }
        else {
            const dur = SETTINGS.imageCurtainDuration;
            this.tweens.add({
                targets: this._curtTop,
                y: this._curtTop.y - SETTINGS.dy,
                duration: dur,
                ease: Phaser.Math.Easing.Sine.InOut,
                onComplete: () => {
                    this._curtTop.visible = false;
                    if (cb) cb.call(ctx);
                }
            });
            this.tweens.add({
                targets: this._curtLogo,
                y: this._curtLogo.y - SETTINGS.dy,
                duration: dur,
                ease: Phaser.Math.Easing.Sine.InOut,
                onComplete: () => {
                    this._curtLogo.visible = false;
                }
            });
            this.tweens.add({
                targets: this._curtBot,
                y: this._curtBot.y + SETTINGS.dy,
                duration: dur,
                ease: Phaser.Math.Easing.Sine.InOut,
                onComplete: () => {
                    this._curtBot.visible = false;
                }
            });

        }
    }

    protected showCurtain(cb?: Function, ctx?: any) {
        if (this._isGraphicsCurtain) {
            const dur = SETTINGS.grCurtainDuration;
            this.tweens.killTweensOf(this._grCurtain);
            this._grCurtain.alpha = 0;
            this._grCurtain.visible = true;
            this.tweens.add({
                targets: this._grCurtain,
                alpha: 1,
                duration: dur,
                onComplete: () => {
                    if (cb) cb.call(ctx);
                }
            });
        }
        else {
            // TODO: image curtains
            const dur = SETTINGS.imageCurtainDuration;

        }
    }


}