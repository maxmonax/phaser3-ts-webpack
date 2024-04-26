import { MyButton } from "@/gui/basic/MyButton";
import { Config } from "../data/Config";
import { FrontEvents } from "../events/FrontEvents";
import { CurtainScene } from "./CurtainScene";
import { SceneNames } from "./SceneNames";

export class MenuScene extends CurtainScene {

    private dummyMain: Phaser.GameObjects.Container;
    // GUI
    private btnPlay: MyButton;

    constructor() {
        super(SceneNames.MenuScene);
    }

    public init(aData: any) { }

    public preload(): void { }

    public create(): void {

        this.dummyMain = this.add.container(0, 0);

        this.btnPlay = new MyButton(this, Config.GW / 2, Config.GH / 2, {
            frame: 'btnPlay',
            onClick: this.onPlayBtnClick,
            context: this
        });
        this.add.existing(this.btnPlay);
        
        this.events.once('shutdown', this.onSceneShutdown, this);
        
        FrontEvents.getInstance().addListener(FrontEvents.EVENT_WINDOW_RESIZE, this.onResize, this);
        this.onResize();

        super.create();

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
        this.showCurtain(() => {
            this.scene.start('GameScene');
        })
    }

    private onSceneShutdown() {
        this.logDebug(`onSceneShutdown()...`);
    }

    update(allTime: number, dtMs: number) {
        // get dt in Sec
        let dt = dtMs * 0.001;
    }

}