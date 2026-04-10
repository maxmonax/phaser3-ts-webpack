import { MyBtnParams, MyButton } from "./MyButton";
import { MyText } from "./MyText";

export class MyTextButton extends MyButton {
    protected _caption: MyText;

    constructor(scene, x, y, aParams: MyBtnParams) {
        super(scene, x, y, aParams);
        
        this._caption = new MyText(scene, 0, 0, 'Button',
            { font: "70px Ubuntu", align: 'center' })
            .setOrigin(0.5)
            .setColor('#ffffff');

        this.add(this._caption);
        
    }



}
