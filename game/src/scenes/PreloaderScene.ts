import { AUDIO_LOAD_DATA } from '@/data/AudioData';
import { Config } from '../data/Config';
import { PreloaderBar } from '../gui/preloader/PreloaderBar';
import { YandexService } from '../services/YandexService';
import { BaseScene } from './BaseScene';
import { SceneNames } from './SceneNames';

enum Styles {
  Color = '#ffffff',
  Font = 'Ubuntu',
}

export class PreloaderScene extends BaseScene {
  private _bar!: PreloaderBar;

  constructor() {
    super(SceneNames.PreloaderScene);
  }

  public preload(): void {
    if (Config.PRELOADER.BAR) {
      this._bar = new PreloaderBar(this, Config.GW_HALF, Config.GH_HALF + 200, true);
      this.add.existing(this._bar);
    }

    // atlases
    this.load.setPath('./assets/atlases/');
    this.load.atlas('game', 'game.png', 'game.json');

    // audio
    this.load.setPath('./assets/audio/');
    for (let i = 0; i < AUDIO_LOAD_DATA.length; i++) {
      const sndData = AUDIO_LOAD_DATA[i];
      this.load.audio(sndData.alias, sndData.file);
    }

    // events
    // Scale asset loading to 0-0.95; the last 5% are reserved for SDK readiness.
    this.load.on(
      'progress',
      (value: number) => {
        if (this._bar) this._bar.progress = value * 0.95;
      },
      this
    );

    this.load.on(
      'complete',
      () => {
        if (this._bar) this._bar.progress = 0.95;
      },
      this
    );
  }

  public create(): void {
    console.log('PreloaderScene create...');

    if (Config.PRELOADER.DRAW_DEBUG_BORDER) {
      this.add.rectangle(Config.GW / 2, Config.GH / 2, Config.GW, Config.GH, 0x0, 0.1);
      this.add.rectangle(Config.GW / 2, Config.GH / 2, Config.GW_SAFE, Config.GH_SAFE, 0x0, 0.1);
    }

    // Assets are loaded. Wait for SDK (may already be ready — resolves instantly).
    YandexService.waitReady().then(() => {
      if (YandexService.initFailed) {
        this.showSdkError();
        return;
      }

      if (this._bar) this._bar.progress = 1;

      if (Config.PRELOADER.TAP_TO_START) {
        this.add
          .text(Config.GW_HALF, Config.GH_HALF - 100, this.t('preloader_title'), {
            font: `90px ${Styles.Font}`,
            color: Styles.Color,
          })
          .setOrigin(0.5);

        this.add
          .text(Config.GW_HALF, Config.GH_HALF + 20, this.t('preloader_start'), {
            font: `50px ${Styles.Font}`,
            color: Styles.Color,
          })
          .setOrigin(0.5);

        this.input.once('pointerdown', () => {
          this.startGame();
        });
      } else {
        this.startGame();
      }
    });
  }

  private showSdkError() {
    if (this._bar) this._bar.setVisible(false);
    this.add
      .text(
        Config.GW_HALF,
        Config.GH_HALF,
        'SDK initialization error.\nPlease refresh the page.',
        { font: `48px ${Styles.Font}`, color: '#ff4444', align: 'center' }
      )
      .setOrigin(0.5);
  }

  private startGame() {
    YandexService.notifyLoaded();
    this.scene.start(SceneNames.MenuScene);
  }
}
