import { Config } from '../data/Config';
import { Params } from '../data/Params';
import { LogMng } from '../utils/LogMng';
import * as MyUtils from '../utils/MyUtils';

export class BootScene extends Phaser.Scene {

    constructor() {
        super('BootScene');
        let anc = window.location.hash.replace("#", "");
        Params.isDebugMode = (anc === "debug");

        // LogMng settings
        if (!Params.isDebugMode) LogMng.setMode(LogMng.MODE_RELEASE);
        LogMng.system('current log mode: ' + LogMng.getMode());

        this.readGETParams();
    }

    private readGETParams() {
        const names = ['1', '2', '3'];

        for (let i = 0; i < names.length; i++) {
            const n = names[i];
            let val = MyUtils.getQueryValue(n);
            if (val != null && val != undefined) {
                switch (i) {
                    case 0: // 1

                        break;

                    case 1: // 2
                        
                        break;

                    case 2: // 3
                        
                        break;

                }
            }
        }
        
    }

    public preload(): void {
        // load preloader atlas and res if u need
        // this.load.atlas('preloader', './assets/atlases/preloader.png', './assets/atlases/preloader.json');
    }

    public create(): void {
        this.scene.start('PreloaderScene');
    }

}