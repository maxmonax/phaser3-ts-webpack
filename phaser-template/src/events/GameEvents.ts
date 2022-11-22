
export const GAME_EVENT_SAVE_DATA = 'saveData';
export const GAME_EVENT_CLOSE_CLICK = 'closeClick';

export class GameEvents extends Phaser.Events.EventEmitter {
    private static instance: GameEvents = null;

    // event list
    static readonly ON_WINDOW_RESIZE = 'WND_RESIZE';

    private constructor() {
        super();
    }

    static getInstance(): GameEvents {
        if (!GameEvents.instance) GameEvents.instance = new GameEvents();
        return GameEvents.instance;
    }

    saveData() {
        window.dispatchEvent(new CustomEvent('gameEvent', { 
            detail: {
                eventName: GAME_EVENT_SAVE_DATA
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