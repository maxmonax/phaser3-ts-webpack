import { AUDIO_LOAD_DATA } from "@/audio/AudioMng";
import { Config } from "../data/Config";
import { PreloaderBar } from "../gui/preloader/PreloaderBar";
import { SceneNames } from "./SceneNames";
    
enum Texts {
    Title = 'Loading complete',
    Message = 'Click anywhere to start'
}

enum Styles {
    Color = '#ffffff',
    Font = 'Ubuntu'
}

export class PreloaderScene extends Phaser.Scene {
    private _bar: PreloaderBar;

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

        // images
        this.load.setPath('./assets/images/');
        this.load.image('bg', 'bg.png');

        // audio
        this.load.setPath('./assets/audio/');
        for (let i = 0; i < AUDIO_LOAD_DATA.length; i++) {
            const sndData = AUDIO_LOAD_DATA[i];
            this.load.audio(sndData.alias, sndData.file);
        }
        
        // events
        this.load.on('progress', (value) => {
            if (this._bar) this._bar.progress = value;
        }, this);

        this.load.on('complete', () => {
            if (this._bar) this._bar.progress = 1;
        }, this);

    }

    public create(): void {
        console.log('PreloaderScene create...');

        if (Config.PRELOADER.DRAW_DEBUG_BORDER) {
            let rFullArea = this.add.rectangle(Config.GW / 2, Config.GH / 2, Config.GW, Config.GH, 0x0, 0.1);
            let rSafeArea = this.add.rectangle(Config.GW / 2, Config.GH / 2, Config.GW_SAFE, Config.GH_SAFE, 0x0, 0.1);
        }

        if (Config.PRELOADER.TAP_TO_START) {

            this.add.text(Config.GW_HALF, Config.GH_HALF - 100,
                Texts.Title,
                {
                    font: `90px ${Styles.Font}`,
                    color: Styles.Color
                })
                .setOrigin(0.5);

            this.add.text(Config.GW_HALF, Config.GH_HALF + 20,
                Texts.Message,
                {
                    font: `50px ${Styles.Font}`,
                    color: Styles.Color
                })
                .setOrigin(0.5);

            this.input.once('pointerdown', () => {
                this.starGame();
            });

        }
        else {
            this.starGame();
        }
    }

    private starGame() {
        this.scene.start(SceneNames.MenuScene);
    }
    
}