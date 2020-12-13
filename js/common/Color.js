import ContrastRatioCalculator from '../contrast-ratio/ContrastRatioCalculator.js';
import HsvRgbConverter from './HsvRgbConverter.js';

export default class Color {

    #colorCode;
    #rgb;
    #hsv;

    constructor(info) {
        if (!info || (!info.colorCode && !info.rgb && !info.hsv)) {
            throw 'colorCode, rgb, hsvのいずれかを指定してください';
        }

        this.#colorCode = info.colorCode;
        if (info.rgb) {
            this.#rgb = Object.assign(info.rgb, {});
        }
        if (info.hsv) {
            this.#hsv = Object.assign(info.hsv, {});
        }
    }

    getColorCode() {
        if (this.#colorCode) {
            return this.#colorCode;
        }

        if (this.#rgb) {
            this.#colorCode = this.#rgbToColorCode();
        } else if (this.#hsv) {
            this.#rgb = this.#hsvToRgb();
            this.#colorCode = this.#rgbToColorCode();
        }

        return this.#colorCode;
    }

    getRgb() {
        if (this.#rgb) {
            return Object.assign(this.#rgb, {});
        }

        if (this.#colorCode) {
            this.#rgb = this.#colorCodeToRgb();
        } else if (this.#hsv) {
            this.#rgb = this.#hsvToRgb();
        }
        return Object.assign(this.#rgb, {});
    }

    getHsv() {
        if (this.#hsv) {
            return Object.assign(this.#hsv, {});
        }

        if (this.#rgb) {
            this.#hsv = this.#rgbToHsv();
        } else if (this.#colorCode) {
            this.#rgb = this.#colorCodeToRgb();
            this.#hsv = this.#rgbToHsv();
        }

        return Object.assign(this.#hsv, {});
    }

    setColorCode(colorCode) {
        this.#colorCode = colorCode;
        this.#rgb = undefined;
        this.#hsv = undefined;
    }

    setRgb(r, g, b) {
        this.#colorCode = undefined;
        this.#rgb = { r: r, g: g, b: b };
        this.#hsv = undefined;
    }

    setHsv(h, s, v) {
        this.#colorCode = undefined;
        this.#rgb = undefined;
        this.#hsv = { h: h, s: s, v: v };
    }

    calcLuminance() {
        const rgb = this.getRgb();
        return ContrastRatioCalculator.calcLuminance(rgb.r, rgb.g, rgb.b);
    }

    equals(obj) {
        if (!obj) {
            return false;
        }
        if (!obj.getColorCode) {
            return false;
        }
        return this.getColorCode().toUpperCase() === obj.getColorCode().toUpperCase();
    }

    #colorCodeToRgb() {
        const r = HsvRgbConverter.colorCodeToR(this.#colorCode);
        const g = HsvRgbConverter.colorCodeToG(this.#colorCode);
        const b = HsvRgbConverter.colorCodeToB(this.#colorCode);
        return { r: r, g: g, b: b };
    }

    #rgbToColorCode() {
        return HsvRgbConverter.rgbToColorCode(
            this.#rgb.r, this.#rgb.g, this.#rgb.b
        );
    }

    #hsvToRgb() {
        return HsvRgbConverter.hsvToRgb(
            this.#hsv.h, this.#hsv.s / 100, this.#hsv.v / 100
        );
    }

    #rgbToHsv() {
        return HsvRgbConverter.rgbToHsv(
            this.#rgb.r, this.#rgb.g, this.#rgb.b
        );
    }
}
