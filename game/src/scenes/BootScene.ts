import { DevParams } from '../data/DevParams';
import { LogMng } from '../utils/LogMng';
import { SceneNames } from './SceneNames';

export class BootScene extends Phaser.Scene {
  constructor() {
    super(SceneNames.BootScene);

    // LogMng settings
    if (!DevParams.debug) LogMng.setMode(LogMng.MODE_RELEASE);
    LogMng.system('log mode: ' + LogMng.getMode());

    this.readGETParams();
  }

  private readGETParams() {
    if (DevParams.testParam != null) {
      LogMng.debug(`GET key "testParam" = ${DevParams.testParam}`);
    }
  }

  public preload(): void {
    // load preloader atlas and res if u need
    // this.load.atlas('preloader', './assets/atlases/preloader.png', './assets/atlases/preloader.json');
  }

  public create(): void {
    this.scene.start(SceneNames.PreloaderScene);
  }
}
