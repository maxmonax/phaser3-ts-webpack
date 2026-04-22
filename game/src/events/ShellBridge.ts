import { EventBus } from './EventBus';
import { ShellEvent } from './ShellEvent';

// Bridge between the game and the outer HTML shell.
// Game → Shell: call static methods (they dispatch CustomEvent on window).
// Shell → Game: call ShellBridge.init() once at startup; shell dispatches 'shellEvent',
//               the game listens on EventBus with ShellInEvent keys.
//
// HTML usage (outgoing):
//   window.addEventListener('gameEvent', (e) => { console.log(e.detail.type); });
//
// HTML usage (incoming):
//   window.dispatchEvent(new CustomEvent('shellEvent', { detail: { type: 'MUTE' } }));
export class ShellBridge {
  /** Call once at startup. Listens for 'shellEvent' from HTML and re-emits on EventBus. */
  static init(): void {
    window.addEventListener('shellEvent', (e: Event) => {
      const { type, ...payload } = (e as CustomEvent<Record<string, unknown>>).detail;
      EventBus.emit(type as string, payload);
    });
  }

  private static dispatch(type: ShellEvent, payload?: Record<string, unknown>): void {
    window.dispatchEvent(new CustomEvent('gameEvent', { detail: { type, ...payload } }));
  }

  /** Notify the shell to persist game data. */
  static saveData(payload?: Record<string, unknown>): void {
    ShellBridge.dispatch(ShellEvent.SAVE_DATA, payload);
  }
}
