import { EventBus } from '../events/EventBus';
import { FrontEvent } from '../events/FrontEvent';
import { Lang, LocaleKey } from '../locale/LocaleKeys';
import { LocaleMng, t } from '../locale/LocaleMng';

export abstract class BaseScene extends Phaser.Scene {
  private _resizeCb: (() => void) | null = null;
  private _langCb: ((lang: Lang) => void) | null = null;

  protected registerResize(cb: () => void): void {
    this._resizeCb = cb;
    EventBus.addListener(FrontEvent.WINDOW_RESIZE, cb, this);
    this.events.once('shutdown', this.unregisterResize, this);
  }

  protected unregisterResize(): void {
    if (!this._resizeCb) return;
    EventBus.removeListener(FrontEvent.WINDOW_RESIZE, this._resizeCb, this);
    this._resizeCb = null;
  }

  protected registerLangChange(cb: (lang: Lang) => void): void {
    this._langCb = cb.bind(this);
    LocaleMng.getInstance().onLangChange(this._langCb);
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
