
export const GAME_EVENT_SAVE_DATA = 'openPlanet';
export const GAME_EVENT_CLOSE_CLICK = 'closeClick';

export class GameEvents extends Phaser.Events.EventEmitter {
    private static instance: GameEvents = null;

    // event list
    static readonly ON_WINDOW_RESIZE = 'WND_RESIZE';

    constructor() {
        if (GameEvents.instance) throw new Error("Don't use EventDispatcher.constructor(), it's SINGLETON, use getInstance() method");
        super();
    }

    static getInstance(): GameEvents {
        if (!GameEvents.instance) GameEvents.instance = new GameEvents();
        return GameEvents.instance;
    }

    saveData(aPlanetId: number) {
        window.dispatchEvent(new CustomEvent('gameEvent', { 
            detail: {
                eventName: GAME_EVENT_SAVE_DATA,
                planetId: aPlanetId
            }
        }));
    }

    closeClick() {
        window.dispatchEvent(new CustomEvent('gameEvent', {
            detail: {
                eventName: GAME_EVENT_CLOSE_CLICK
            }
        }));
    }

}