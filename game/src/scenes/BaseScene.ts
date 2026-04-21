import { FrontEvents } from '../events/FrontEvents';

export abstract class BaseScene extends Phaser.Scene {

    private _resizeCb: (() => void) | null = null;

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

}
