// Events sent from game to HTML shell (via ShellBridge.dispatch)
export enum ShellEvent {
  SAVE_DATA = 'SAVE_DATA',
}

// Events sent from HTML shell to game (via ShellBridge.init listener)
export enum ShellInEvent {
  MUTE = 'MUTE',
}
