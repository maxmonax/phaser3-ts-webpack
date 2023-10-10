import { AudioAlias, AudioMng } from "@/audio/AudioMng";
import { Config } from "../data/Config";
import { Params } from "../data/Params";
import { FrontEvents } from "../events/FrontEvents";
import { CurtainScene } from "./CurtainScene";
import { SceneNames } from "./SceneNames";

export class GameScene extends CurtainScene {
    
    // GUI
    private btnBack: Phaser.GameObjects.Image;


    constructor() {
        super(SceneNames.GameScene);
    }

    public create(): void {

        AudioMng.scene = this;

        this.btnBack = new Phaser.GameObjects.Image(this, 0, 80, 'game', 'btnBack');
        this.btnBack.setInteractive({ cursor: 'pointer' });
        this.btnBack.on('pointerdown', () => {
            AudioMng.playSfx(AudioAlias.Click);
        }, this);
        this.btnBack.on('pointerup', () => {
            this.onBackClick();
        }, this);
        this.add.existing(this.btnBack);

        let scoreText = new Phaser.GameObjects.Text(this, Config.GW / 2, 200, 'Game Screen\nCustom google font', {
            fontFamily: 'Ubuntu',
            color: '#ffffff',
            align: 'center'
        });
        scoreText.setFontSize(80);
        scoreText.setOrigin(0.5, 0.5);
        this.add.existing(scoreText);

        this.input.on('pointerdown', this.onPointerDown, this);
        this.input.on('pointermove', this.onPointerMove, this);
        // this.input.on('pointerup', this.onPointerUp, this);

        this.input.on('dragstart', this.onDragStart, this);
        this.input.on('drag', this.onDrag, this);
        this.input.on('dragend', this.onDragEnd, this);
        
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

    private onPointerDown(p, aObj) {

    }

    private onPointerMove(p) {
        
    }

    private onDragStart(pointer, aObj, dragX, dragY) {

    }

    private onDrag(pointer, aObj, dragX, dragY) {
        aObj.x = dragX;
        aObj.y = dragY;
    }

    private onDragEnd(pointer, aObj) {
        this.logDebug(`onDragEnd: obj ${aObj['aliasName']}: ${aObj.x}, ${aObj.y}`);

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