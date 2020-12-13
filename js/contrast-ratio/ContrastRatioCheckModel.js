import Color from '../common/Color.js';
import CommonEventDispatcher from '../common/CommonEventDispatcher.js';
import CustomEventNames from '../common/CustomEventNames.js';

export default class ContrastRatioCheckModel {

    #backgroundColor;
    #textColor;

    constructor() {
        this.#backgroundColor = undefined;
        this.#textColor = undefined;
    }

    setBackgroundColorFromColorCode(colorCode) {
        this.#backgroundColor = new Color({
            colorCode: colorCode
        });
        this.#dispatchEvent();
    }

    setTextColorFromColorCode(colorCode) {
        this.#textColor = new Color({
            colorCode: colorCode
        });
        this.#dispatchEvent();
    }

    swapColors() {
        const currentBgColor = this.#backgroundColor;
        this.#backgroundColor = this.#textColor;
        this.#textColor = currentBgColor;
        this.#dispatchEvent();
    }

    #dispatchEvent() {
        CommonEventDispatcher.dispatch(CustomEventNames.COLOR_PICKER__CHANGE_CONTRAST_RATIO_CHECK_COLOR, {
            backgroundColor: this.#backgroundColor,
            textColor: this.#textColor
        });
    }
}
