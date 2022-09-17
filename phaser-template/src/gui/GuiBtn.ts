import { LogMng } from "../utils/LogMng";

export type GuiBtnInitParams = {
    texture?: string;
    frame?: string;
    scaleX?: number;
    scaleY?: number;
};

export class GuiBtn extends Phaser.GameObjects.Container {
    private _params: GuiBtnInitParams;
    private _img: Phaser.GameObjects.Image;

    constructor(scene, x, y, aParams: GuiBtnInitParams) {
        super(scene, x, y);
        this.init(aParams);
    }

    private init(aParams: GuiBtnInitParams) {

        this._params = aParams;

        if (this._params.texture) {
            if (this._params.frame) {
                this._img = new Phaser.GameObjects.Image(this.scene, 0, 0, this._params.texture, this._params.frame);
            }
            else {
                this._img = new Phaser.GameObjects.Image(this.scene, 0, 0, this._params.texture);
            }
            this._img.setInteractive({ cursor: 'pointer' });
            this._img['btnParent'] = this;
            this._img.scaleX = this._params.scaleX || 1;
            this._img.scaleY = this._params.scaleY || 1;
            this.add(this._img);
        }
        
        let isPressed = false;
        this.scene.input.addListener('pointerdown', (aPointer, aObj) => {
            if (aObj[0] == this._img) {
                isPressed = true;
                this.scene.sound.play('btn');
            }
        }, this);
        this.scene.input.addListener('pointerup', (aPointer, aObj) => {
            if (isPressed) {
                if (aObj[0] == this._img) this.emit('clicked', aParams);
            }
        }, this);

    }


}