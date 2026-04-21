import { FrontEvents } from '../events/FrontEvents';
import { Lang, LocaleKey } from '../locale/LocaleKeys';
import { LocaleMng, t } from '../locale/LocaleMng';

export abstract class BaseScene extends Phaser.Scene {

    private _resizeCb: (() => void) | null = null;
    private _langCb: ((lang: Lang) => void) | null = null;

    protected registerResize(cb: () => void): void {
        this._resizeCb = cb;
        FrontEvents.getInstance().addListener(FrontEvents.EVENT_WINDOW_RESIZE, cb, this);
        this.events.once('shutdown', this.unregisterResize, this);
    }

    protected unregisterResize(): void {
        if (!this._resizeCb) return;
        FrontEvents.getInstance().removeListener(FrontEvents.EVENT_WINDOW_RESIZE, this._resizeCb, this);
        this._resizeCb = null;
    }

    protected registerLangChange(cb: (lang: Lang) => void): void {
        this._langCb = cb;
        LocaleMng.getInstance().onLangChange(cb);
        this.events.once('shutdown', this.unregisterLangChange, this);
    }

    protected unregisterLangChange(): void {
        if (!this._langCb) return;
        LocaleMng.getInstance().offLangChange(this._langCb);
        this._langCb = null;
    }

    /** Shorthand for `t()` available in any scene without extra import. */
    protected t(key: LocaleKey, params?: Record<string, string | number>): string {
        return t(key, params);
    }

}
