export enum AudioAlias {
  Click = 'Click',
}

export type AudioLoadData = {
  alias: AudioAlias;
  file: string;
  maxInstances?: number;
};

export const AUDIO_LOAD_DATA: ReadonlyArray<AudioLoadData> = [
  { alias: AudioAlias.Click, file: 'click.mp3', maxInstances: 1 },
];
