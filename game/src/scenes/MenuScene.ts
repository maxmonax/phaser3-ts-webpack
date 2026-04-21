import { AudioMng } from '@/audio/AudioMng';
import { MyButton } from '@/gui/basic/MyButton';
import { MyTextButton } from '@/gui/basic/MyTextButton';
import { Config } from '../data/Config';
import { Lang } from '../locale/LocaleKeys';
import { LocaleMng } from '../locale/LocaleMng';
import { LogMng } from '../utils/LogMng';
import { BaseScene } from './BaseScene';
import { SceneNames } from './SceneNames';
import { TransitionScene } from './TransitionScene';

const LANGS: Lang[] = ['en', 'ru'];

export class MenuScene extends BaseScene {
  private _dummyMain!: Phaser.GameObjects.Container;
  private _btnPlay!: MyButton;
  private _title!: Phaser.GameObjects.Text;
  private _btnLang!: MyTextButton;

  constructor() {
    super(SceneNames.MenuScene);
  }

  public init(_aData: unknown) {}

  public preload(): void {}

  public create(): void {
    AudioMng.init(this);

    this._dummyMain = this.add.container(0, 0);

    this._title = this.add
      .text(Config.GW_HALF, Config.GH_HALF - 400, this.t('menu_title'), {
        fontFamily: 'Ubuntu',
        fontSize: '80px',
        color: '#ffffff',
      })
      .setOrigin(0.5);
    this._dummyMain.add(this._title);

    this._btnPlay = new MyButton(this, Config.GW_HALF, Config.GH_HALF, {
      texture: 'game',
      frame: 'btnPlay',
      onClick: this.onPlayBtnClick,
      context: this,
    });
    this._dummyMain.add(this._btnPlay);

    this._btnLang = new MyTextButton(this, Config.GW_HALF, Config.GH_HALF + 400, {
      size: { w: 160, h: 80 },
      onClick: this.onLangBtnClick,
      context: this,
    });
    this._btnLang.setText(this.t('menu_lang_btn'));
    this._dummyMain.add(this._btnLang);

    this.registerLangChange(this.onLangChange);
    this.events.once('shutdown', this.onSceneShutdown, this);

    this.registerResize(this.onResize);
    this.onResize();
  }

  private onLangChange(_lang: Lang): void {
    this._title.setText(this.t('menu_title'));
    this._btnLang.setText(this.t('menu_lang_btn'));
  }

  private onLangBtnClick(): void {
    const langs = LANGS;
    const current = LocaleMng.getInstance().getLang();
    const next = langs[(langs.indexOf(current) + 1) % langs.length];
    LocaleMng.getInstance().setLang(next);
  }

  private onResize() {
    this.updateLayout();
  }

  private updateLayout() {}

  private onPlayBtnClick() {
    TransitionScene.change(this, SceneNames.GameScene);
  }

  private onSceneShutdown() {
    LogMng.debug(`${SceneNames.MenuScene}: onSceneShutdown()...`);
  }
}
