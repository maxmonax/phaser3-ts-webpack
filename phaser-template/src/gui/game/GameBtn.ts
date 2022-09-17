import { LogMng } from "../../utils/LogMng";
import { MyMath } from "../../utils/MyMath";

export type GameBtnInitParams = {
    id?: number;
    color?: number;
    glowColor?: number;
    sound?: string;
    scaleX?: number;
    scaleY?: number;
    img?: string;
};

export class GameBtn extends Phaser.GameObjects.Container {
    private _params: GameBtnInitParams;
    private bgImg: Phaser.GameObjects.Image;
    private glowImg: Phaser.GameObjects.Image;
    private _snd: string;
    private _isMouseBlock = false;

    constructor(scene, x, y, aParams: GameBtnInitParams) {
        super(scene, x, y);
        this.init(aParams);
    }

    private init(aParams: GameBtnInitParams) {

        this._params = aParams;

        this._snd = this._params.sound || 'btn';

        if (this._snd == 'ins_biola') this._snd = `ins_biola_${MyMath.randomIntInRange(1, 3)}`;
        if (this._snd == 'ins_flute') this._snd = `ins_flute_${MyMath.randomIntInRange(1, 3)}`;

        this.bgImg = new Phaser.GameObjects.Image(this.scene, 0, 0, 'game', 'cell/bg');
        this.bgImg.setInteractive({ cursor: 'pointer' });
        this.bgImg['btnParent'] = this;
        this.bgImg.scaleX = this._params.scaleX || 1;
        this.bgImg.scaleY = this._params.scaleY || 1;
        this.add(this.bgImg);

        let color = new Phaser.GameObjects.Image(this.scene, 0, 0, 'game', 'cell/color');
        color.tint = this._params.color || 0xffffff;
        color.scaleX = this._params.scaleX || 1;
        color.scaleY = this._params.scaleY || 1;
        this.add(color);

        let glare = new Phaser.GameObjects.Image(this.scene, 0, 20, 'game', 'cell/glare');
        glare.scaleX = this._params.scaleX || 1;
        glare.scaleY = this._params.scaleY || 1;
        glare.y *= glare.scaleY;
        this.add(glare);

        let border = new Phaser.GameObjects.Image(this.scene, 0, 0, 'game', 'cell/border');
        border.scaleX = this._params.scaleX || 1;
        border.scaleY = this._params.scaleY || 1;
        this.add(border);

        this.glowImg = new Phaser.GameObjects.Image(this.scene, 0, 0, 'game', 'cell/glow');
        this.glowImg.tint = this._params.glowColor | 0xffffff;
        this.glowImg.tintFill = true;
        this.glowImg.alpha = 0;
        this.glowImg.scaleX = this._params.scaleX || 1;
        this.glowImg.scaleY = this._params.scaleY || 1;
        this.add(this.glowImg);

        if (this._params.img) {
            let img = new Phaser.GameObjects.Image(this.scene, 0, 0, 'game', this._params.img);
            this.add(img);
        }

        let isPressed = false;
        this.scene.input.addListener('pointerdown', (aPointer, aObj) => {
            if (this._isMouseBlock) return;
            if (aObj[0] == this.bgImg) {
                isPressed = true;
                this.glow();
                this.scene.sound.play(this._snd);
            }
        }, this);
        this.scene.input.addListener('pointerup', (aPointer, aObj) => {
            if (this._isMouseBlock) return;
            if (isPressed) {
                if (aObj[0] == this.bgImg) this.emit('clicked', aParams);
                this.unglow();
            }
        }, this);

    }

    public get isMouseBlock(): boolean {
        return this._isMouseBlock;
    }

    public set isMouseBlock(v: boolean) {
        if (v == true && !this._isMouseBlock) {
            this.bgImg.removeInteractive();
            this.unglow();
        }
        if (v == false && this._isMouseBlock) {
            this.bgImg.setInteractive({ cursor: 'pointer' });
        }
        this._isMouseBlock = v;
        // LogMng.debug(`isMouseBlock: ${v}`);
    }

    glow() {
        this.glowImg.alpha = .4;
    }

    unglow() {
        this.glowImg.alpha = 0;
    }

    doBlink() {
        this.glow();
        this.scene.sound.play(this._snd);
        setTimeout(() => {
            this.unglow();
        }, 600);
    }


}