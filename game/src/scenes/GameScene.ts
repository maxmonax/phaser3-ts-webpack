import { AudioMng } from '@/audio/AudioMng';
import { Config } from '../data/Config';
import { Params } from '../data/Params';
import { SceneNames } from './SceneNames';
import { MyContainer } from '@/gui/basic/MyContainer';
import { MyButton } from '@/gui/basic/MyButton';
import { TransitionScene } from './TransitionScene';
import { BaseScene } from './BaseScene';

export class GameScene extends BaseScene {
  private _dummyGame!: MyContainer;
  private _dummyGui!: MyContainer;
  // GUI
  private _btnBack!: MyButton;

  constructor() {
    super(SceneNames.GameScene);
  }

  public create(): void {
    AudioMng.init(this);

    this._dummyGame = new MyContainer(this, 0, 0);
    this.add.existing(this._dummyGame);

    this._dummyGui = new MyContainer(this, 0, 0);
    this.add.existing(this._dummyGui);

    this._btnBack = new MyButton(this, 0, 80, {
      texture: 'game',
      frame: 'btnBack',
      onClick: this.onBackClick,
      context: this,
    });
    this.add.existing(this._btnBack);

    const scoreText = new Phaser.GameObjects.Text(
      this,
      Config.GW / 2,
      Config.GH_HALF,
      'Game Screen\nCustom google font',
      {
        fontFamily: 'Ubuntu',
        color: '#ffffff',
        align: 'center',
      }
    )
      .setFontSize(80)
      .setOrigin(0.5, 0.5);
    this.add.existing(scoreText);

    // poiter events example
    // this.input.on('pointerdown', this.onPointerDown, this);
    // this.input.on('pointermove', this.onPointerMove, this);
    // this.input.on('pointerup', this.onPointerUp, this);

    // drag n drop events example
    // this.input.on('dragstart', this.onDragStart, this);
    // this.input.on('drag', this.onDrag, this);
    // this.input.on('dragend', this.onDragEnd, this);

    this.registerResize(this.onResize);
    this.onResize();
  }

  private onResize() {
    this.updateBtnBackPos();
  }

  private updateBtnBackPos() {
    if (this._btnBack) {
      this._btnBack.x = (Config.GW - Params.gameWidth) / 2 + 90;
    }
  }

  private onBackClick() {
    TransitionScene.change(this, SceneNames.MenuScene);
  }

  update(_allTime: number, _dtMs: number) {}
}
