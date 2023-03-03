import { Config } from "../data/Config";
import { PreloaderBar } from "../gui/preloader/PreloaderBar";
    
enum Texts {
    Title = 'Loading complete',
    Message = 'Click anywhere to start'
}

enum Styles {
    Color = '#AAAAAA',
    Font = 'Arial'
}

export class PreloaderScene extends Phaser.Scene {
    private bg: Phaser.GameObjects.Image;
    private bar: PreloaderBar;

    constructor() {
        super('PreloaderScene');
    }

    public preload(): void {
        // this.bg = this.add.image(Config.GW_HALF, Config.GH_HALF, 'preloader', 'bg');

        if (Config.TAP_TO_START) {
            this.bar = new PreloaderBar(this, Config.GW_HALF, Config.GH_HALF + 200, true);
            this.add.existing(this.bar);
        }

        // atlases
        this.load.setPath('./assets/atlases/');
        this.load.atlas('game', 'game.png', 'game.json');

        // images
        this.load.setPath('./assets/images/');
        this.load.image('bg', 'bg.png');
        
        // events
        this.load.on('progress', function (value) {
            if (Config.TAP_TO_START) this.bar.progress = value;
        }, this);

        this.load.on('complete', function () {

        }, this);

    }

    public create(): void {
        console.log('PreloaderScene create...');

        if (Config.DRAW_DEBUG_BORDER) {
            let rFullArea = this.add.rectangle(Config.GW / 2, Config.GH / 2, Config.GW, Config.GH, 0x00FF00, 0.1);
            let rSafeArea = this.add.rectangle(Config.GW / 2, Config.GH / 2, Config.GW_SAFE, Config.GH_SAFE, 0x0000FF, 0.1);
        }

        if (Config.TAP_TO_START) {

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
                this.scene.start('MenuScene');
            });

        }
        else {
            this.scene.start('MenuScene');
        }
    }

    public update() {
        
    }


}