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
        
        const LIST = [
            {
                // anti aliasing
                keys: ['aa'],
                onReadHandler: (aValue: string) => {
                    LogMng.debug(`GET key "aa" = ${aValue}`);
                }
            }
        ];

        for (let i = 0; i < LIST.length; i++) {
            const listItem = LIST[i];
            const keys = listItem.keys;
            for (let j = 0; j < keys.length; j++) {
                const getName = keys[j];
                let qValue = MyUtils.getQueryValue(getName);
                if (qValue != null && qValue != undefined) {
                    listItem.onReadHandler(qValue);
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