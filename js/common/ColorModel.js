import HsvRgbConverter from '../common/HsvRgbConverter.js';

const InputChecker = (() => {

    const checkInputRange = (input, item, min, max) => {
        const reg = /^\d+$/;
        if (reg.test(input) && min <= input && input <= max) {
            return true;
        }
        alert(`${item}は${min}以上、${max}以下の整数で入力してください`);
        return false;
    };

    const checkColorCodeRgb =  value => {
        if (isNaN(value)) {
            alert('入力されたカラーコードが不正です');
            return false;
        }
        return true;
    };

    return {

        checkColorCodeRgbAll: (r, g, b) => {
            return checkColorCodeRgb(r)
                    && checkColorCodeRgb(g)
                    && checkColorCodeRgb(b);
        },

        checkRgbInputRange: (input) => {
            return checkInputRange(input, 'R、G、B', 0, 255);
        },

        checkHueInputRange: (input) => {
            return checkInputRange(input, 'H', 0, 360);
        },

        checkSvInputRange: (input) => {
            return checkInputRange(input, 'S、V', 0, 100);
        }
    };
})();

export default class ColorModel {

    #eventName;
    #color;

    constructor(eventName, color) {
        this.#eventName = eventName;
        this.#color = color;
    }

    setColorCode(colorCode) {

        const r = HsvRgbConverter.colorCodeToR(colorCode);
        const g = HsvRgbConverter.colorCodeToG(colorCode);
        const b = HsvRgbConverter.colorCodeToB(colorCode);

        if (InputChecker.checkColorCodeRgbAll(r, g, b)) {
            this.#color.setRgb(r, g, b);
        }

        this.#dispatchEvent();
    }

    setRgb(r, g, b) {
        if(InputChecker.checkRgbInputRange(r) && InputChecker.checkRgbInputRange(g) && InputChecker.checkRgbInputRange(b)) {
            this.#color.setRgb(r, g, b);
        }
        this.#dispatchEvent();
    }

    setHsv(h, s, v) {
        if(InputChecker.checkHueInputRange(h) && InputChecker.checkSvInputRange(s) && InputChecker.checkSvInputRange(v)) {
            this.#color.setHsv(h, s, v);
        }
        this.#dispatchEvent();
    }

    getColor() {
        return this.#color;
    }

    #dispatchEvent() {
        document.dispatchEvent(new CustomEvent(this.#eventName, {
            detail: {
                color: this.#color
            }
        }));
    }

}
