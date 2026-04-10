
/**
 * Events from game client
 * How to use: GameEvents.getInstance().addListener(GameEvents.ON_WINDOW_RESIZE, () => {}, this);
 */
export class GameEvents extends Phaser.Events.EventEmitter {
    private static instance: GameEvents;

    static readonly EVENT_SAVE_DATA = 'EVENT_SAVE_DATA';
    static readonly EVENT_CLOSE_CLICK = 'EVENT_CLOSE_CLICK';

    private constructor() {
        super();
    }

    static getInstance(): GameEvents {
        if (!GameEvents.instance) GameEvents.instance = new GameEvents();
        return GameEvents.instance;
    }

    /**
     * For Example Event
     */
    saveData() {
        window.dispatchEvent(new CustomEvent('gameEvent', { 
            detail: {
                eventName: GameEvents.EVENT_SAVE_DATA
            }
        }));
    }
    
    closeClick() {
        window.dispatchEvent(new CustomEvent('gameEvent', {
            detail: {
                eventName: GameEvents.EVENT_CLOSE_CLICK
            }
        }));
    }

}