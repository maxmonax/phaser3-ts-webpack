import { AudioMng } from "@/audio/AudioMng";
import { MyButton } from "@/gui/basic/MyButton";
import { Config } from "../data/Config";
import { LogMng } from "../utils/LogMng";
import { SceneNames } from "./SceneNames";
import { TransitionScene } from "./TransitionScene";
import { BaseScene } from "./BaseScene";

export class MenuScene extends BaseScene {

    private _dummyMain!: Phaser.GameObjects.Container;
    // GUI
    private _btnPlay!: MyButton;

    constructor() {
        super(SceneNames.MenuScene);
    }

    public init(_aData: unknown) { }
    
    public preload(): void { }

    public create(): void {
        AudioMng.init(this);

        this._dummyMain = this.add.container(0, 0);

        this._btnPlay = new MyButton(this, Config.GW / 2, Config.GH / 2, {
            texture: 'game',
            frame: 'btnPlay',
            onClick: this.onPlayBtnClick,
            context: this
        });
        this._dummyMain.add(this._btnPlay);
        
        this.events.once('shutdown', this.onSceneShutdown, this);

        this.registerResize(this.onResize);
        this.onResize();

        // global music example
        // if (!Params.music) {
        //     Params.music = this.sound.add('music', { loop: true, volume: .2 });
        //     Params.music.play();
        // }
        // else {
        //     Params.music.volume = .2;
        // }

    }

    private onResize() {
        this.updateBtnClosePos();
    }

    private updateBtnClosePos() {
        
    }

    private onPlayBtnClick() {
        TransitionScene.change(this, SceneNames.GameScene);
    }

    private onSceneShutdown() {
        LogMng.debug(`${SceneNames.MenuScene}: onSceneShutdown()...`);
    }

    update(_allTime: number, _dtMs: number) {
    }

}
