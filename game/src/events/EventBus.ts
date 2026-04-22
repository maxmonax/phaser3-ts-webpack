import { Events } from 'phaser';

// Single event bus for communication between scenes, components and HTML shell
export const EventBus = new Events.EventEmitter();
