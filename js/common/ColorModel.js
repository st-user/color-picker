import HsvRgbConverter from '../common/HsvRgbConverter.js';

const InputChecker = (() => {

    const checkInputRange = (input, item, min, max) => {
        const reg = /^\d+$/;
        if (reg.test(input) && min <= input && input <= max) {
            return '';
        }
        return `${item}は${min}以上、${max}以下の整数で入力してください`;
    };

    const checkColorCodeRgb =  value => {
        if (!isNaN(value)) {
            return '';
        }
        return '入力されたカラーコードが不正です';
    };

    return {

        checkColorCodeRgbAll: (r, g, b) => {
            let error = '';
            error = error || checkColorCodeRgb(r);
            error = error || checkColorCodeRgb(g);
            error = error || checkColorCodeRgb(b);
            return error;
        },

        checkRgbInputRange: (input) => {
            return checkInputRange(input, 'R, G, B', 0, 255);
        },

        checkHueInputRange: (input) => {
            return checkInputRange(input, 'H', 0, 360);
        },

        checkSvInputRange: (input) => {
            return checkInputRange(input, 'S, V', 0, 100);
        }
    };
})();

const parseInt10 = value => parseInt(value, 10);

export default class ColorModel {

    #eventContextInfo;
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

        const error = InputChecker.checkColorCodeRgbAll(r, g, b);
        if (!error) {
            this.#color.setRgb(r, g, b);
        }

        this.#dispatchEvent();
        return error;
    }

    setEventContextInfo(info) {
        this.#eventContextInfo = info;
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
        let error = '';
        error = error || InputChecker.checkRgbInputRange(r);
        error = error || InputChecker.checkRgbInputRange(g);
        error = error || InputChecker.checkRgbInputRange(b);

        if(!error) {
            this.#color.setRgb(parseInt10(r), parseInt10(g), parseInt10(b));
        }
        this.#dispatchEvent();
        return error;
    }

    setHsvFromString(h, s, v) {
        let error = '';
        error = error || InputChecker.checkHueInputRange(h);
        error = error || InputChecker.checkSvInputRange(s);
        error = error || InputChecker.checkSvInputRange(v);

        if(!error) {
            this.#color.setHsv(parseInt10(h), parseInt10(s), parseInt10(v));
        }
        this.#dispatchEvent();
        return error;
    }

    getColor() {
        return this.#color;
    }

    #dispatchEvent() {
        document.dispatchEvent(new CustomEvent(this.#eventName, {
            detail: {
                contextInfo: this.#eventContextInfo,
                color: this.#color
            }
        }));
        this.#eventContextInfo = undefined;
    }

}
