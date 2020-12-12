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

const parseInt10 = value => parseInt(value, 10);

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

    setRgbFromValidInteger(r, g, b) {
        this.#color.setRgb(r, g, b);
        this.#dispatchEvent();
    }

    setHsvFromValidInteger(h, s, v) {
        this.#color.setHsv(h, s, v);
        this.#dispatchEvent();
    }

    setRgbFromString(r, g, b) {
        if(InputChecker.checkRgbInputRange(r) && InputChecker.checkRgbInputRange(g) && InputChecker.checkRgbInputRange(b)) {
            this.#color.setRgb(parseInt10(r), parseInt10(g), parseInt10(b));
        }
        this.#dispatchEvent();
    }

    setHsvFromString(h, s, v) {
        if(InputChecker.checkHueInputRange(h) && InputChecker.checkSvInputRange(s) && InputChecker.checkSvInputRange(v)) {
            this.#color.setHsv(parseInt10(h), parseInt10(s), parseInt10(v));
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
