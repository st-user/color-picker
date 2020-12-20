/*globals require */
/*globals describe */
/*globals it */
const expect = require('expect.js');
import HsvRgbConverter from '../js/common/HsvRgbConverter.js';

const assertRgb = (expected, actual) => {
    expect(actual.r).to.be(expected.r);
    expect(actual.g).to.be(expected.g);
    expect(actual.b).to.be(expected.b);
};

const doAssertHsvConvertion = (r, g, b, h, s, v) => {
    assertRgb({ r: r, g: g, b: b }, HsvRgbConverter.hsvToRgb(h, s, v));
};

const assertHsv = (expected, actual) => {
    expect(actual.h).to.be(expected.h);
    expect(actual.s).to.be(expected.s);
    expect(actual.v).to.be(expected.v);
};

const doAssertRgbConvertion = (h, s, v, r, g, b) => {
    assertHsv({ h: h, s: s, v: v }, HsvRgbConverter.rgbToHsv(r, g, b));
};

describe('HsvRgbConverter', () => {

    describe('#hsvToRgb()', () => {
        //https://www.rapidtables.com/convert/color/hsv-to-rgb.html
        // TODO 適当な名称にrename
        it('HsvRgbConverter.hsvToRgb - 1', () => doAssertHsvConvertion(0, 0, 0,   0, 0, 0));
        it('HsvRgbConverter.hsvToRgb - 2', () => doAssertHsvConvertion(255, 255, 255,   0, 0, 1));
        it('HsvRgbConverter.hsvToRgb - 3', () => doAssertHsvConvertion(255, 0, 0,   0, 1, 1));
        it('HsvRgbConverter.hsvToRgb - 4', () => doAssertHsvConvertion(0, 255, 0,   120, 1, 1));
        it('HsvRgbConverter.hsvToRgb - 5', () => doAssertHsvConvertion(0, 0, 255,   240, 1, 1));
        it('HsvRgbConverter.hsvToRgb - 6', () => doAssertHsvConvertion(255, 255, 0,   60, 1, 1));
        it('HsvRgbConverter.hsvToRgb - 7', () => doAssertHsvConvertion(0, 255, 255,   180, 1, 1));
        it('HsvRgbConverter.hsvToRgb - 8', () => doAssertHsvConvertion(255, 0, 255,   300, 1, 1));
        it('HsvRgbConverter.hsvToRgb - 9', () => doAssertHsvConvertion(191, 191, 191,   0, 0, 0.75));
        it('HsvRgbConverter.hsvToRgb - 10', () => doAssertHsvConvertion(128, 128, 128,   0, 0, 0.5));
        it('HsvRgbConverter.hsvToRgb - 11', () => doAssertHsvConvertion(128, 0, 0,   0, 1, 0.5));
        it('HsvRgbConverter.hsvToRgb - 12', () => doAssertHsvConvertion(128, 128, 0,   60, 1, 0.5));
        it('HsvRgbConverter.hsvToRgb - 13', () => doAssertHsvConvertion(0, 128, 0,   120, 1, 0.5));
        it('HsvRgbConverter.hsvToRgb - 14', () => doAssertHsvConvertion(128, 0, 128,   300, 1, 0.5));
        it('HsvRgbConverter.hsvToRgb - 15', () => doAssertHsvConvertion(0, 128, 128,   180, 1, 0.5));
        it('HsvRgbConverter.hsvToRgb - 16', () => doAssertHsvConvertion(0, 0, 128,   240, 1, 0.5));

    });

    describe('#rgbToHsv()', () => {
        //https://www.rapidtables.com/convert/color/rgb-to-hsv.html
        // TODO 適当な名称にrename
        it('HsvRgbConverter.rgbToHsv - 1', () => doAssertRgbConvertion(0, 0, 0,  0, 0, 0));
        it('HsvRgbConverter.rgbToHsv - 2', () => doAssertRgbConvertion(0, 0, 100,  255, 255, 255));
        it('HsvRgbConverter.rgbToHsv - 3', () => doAssertRgbConvertion(0, 100, 100,  255, 0, 0));
        it('HsvRgbConverter.rgbToHsv - 4', () => doAssertRgbConvertion(120, 100, 100,  0, 255, 0));
        it('HsvRgbConverter.rgbToHsv - 5', () => doAssertRgbConvertion(240, 100, 100,  0, 0, 255));
        it('HsvRgbConverter.rgbToHsv - 6', () => doAssertRgbConvertion(60, 100, 100,  255, 255, 0));
        it('HsvRgbConverter.rgbToHsv - 7', () => doAssertRgbConvertion(180, 100, 100,  0, 255, 255));
        it('HsvRgbConverter.rgbToHsv - 8', () => doAssertRgbConvertion(300, 100, 100,  255, 0, 255));
        it('HsvRgbConverter.rgbToHsv - 9', () => doAssertRgbConvertion(0, 0, 75,  191, 191, 191));
        it('HsvRgbConverter.rgbToHsv - 10', () => doAssertRgbConvertion(0, 0, 50,  128, 128, 128));
        it('HsvRgbConverter.rgbToHsv - 11', () => doAssertRgbConvertion(0, 100, 50,  128, 0, 0));
        it('HsvRgbConverter.rgbToHsv - 12', () => doAssertRgbConvertion(60, 100, 50,  128, 128, 0));
        it('HsvRgbConverter.rgbToHsv - 13', () => doAssertRgbConvertion(120, 100, 50,  0, 128, 0));
        it('HsvRgbConverter.rgbToHsv - 14', () => doAssertRgbConvertion(300, 100, 50,  128, 0, 128));
        it('HsvRgbConverter.rgbToHsv - 15', () => doAssertRgbConvertion(180, 100, 50,  0, 128, 128));
        it('HsvRgbConverter.rgbToHsv - 16', () => doAssertRgbConvertion(240, 100, 50,  0, 0, 128));

    });
});
