import { Config } from "../data/Config";
import { Params } from "../data/Params";
import { FrontEvents } from "../events/FrontEvents";
import { CurtainScene } from "./CurtainScene";
import { SceneNames } from "./SceneNames";
import { MyContainer } from "@/gui/basic/MyContainer";
import { MyButton } from "@/gui/basic/MyButton";

export class GameScene extends CurtainScene {
    
    private _dummyGame: MyContainer;
    private _dummyGui: MyContainer;
    // GUI
    // private btnBack: Phaser.GameObjects.Image;
    private btnBack: MyButton;


    constructor() {
        super(SceneNames.GameScene);
    }

    public create(): void {

        this._dummyGame = new MyContainer(this, 0, 0);
        this.add.existing(this._dummyGame);

        this._dummyGui = new MyContainer(this, 0, 0);
        this.add.existing(this._dummyGui);

        this.btnBack = new MyButton(this, 0, 80, {
            frame: 'btnBack',
            onClick: this.onBackClick,
            context: this
        });
        this.add.existing(this.btnBack);

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
        this.onResize();

        super.create();

    }

    private onResize() {
        this.updateBtnBackPos();
    }

    private updateBtnBackPos() {
        if (this.btnBack) {
            this.btnBack.x = (Config.GW - Params.gameWidth) / 2 + 90;
        }
    }

    private onBackClick() {
        this.showCurtain(() => {
            this.scene.start(SceneNames.MenuScene);
        });
    }
    
    update(allTime: number, dtMs: number) {
        // get dt in Sec
        let dt = dtMs * 0.001;
    }

}