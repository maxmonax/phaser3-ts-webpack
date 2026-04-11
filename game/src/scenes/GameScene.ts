import { AudioMng } from "@/audio/AudioMng";
import { Config } from "../data/Config";
import { Params } from "../data/Params";
import { FrontEvents } from "../events/FrontEvents";
import { SceneNames } from "./SceneNames";
import { MyContainer } from "@/gui/basic/MyContainer";
import { MyButton } from "@/gui/basic/MyButton";
import { TransitionScene } from "./TransitionScene";

export class GameScene extends Phaser.Scene {
    
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
            frame: 'btnBack',
            onClick: this.onBackClick,
            context: this
        });
        this.add.existing(this._btnBack);

        let scoreText = new Phaser.GameObjects.Text(this, Config.GW / 2, Config.GH_HALF, 'Game Screen\nCustom google font', {
            fontFamily: 'Ubuntu',
            color: '#ffffff',
            align: 'center'
        })
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
        
        FrontEvents.getInstance().addListener(FrontEvents.EVENT_WINDOW_RESIZE, this.onResize, this);
        this.events.once('shutdown', () => {
            FrontEvents.getInstance().removeListener(FrontEvents.EVENT_WINDOW_RESIZE, this.onResize, this);
        }, this);
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
    
    update(_allTime: number, _dtMs: number) {
    }

}
