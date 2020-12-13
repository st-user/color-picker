/*globals require */
/*globals describe */
/*globals it */
const expect = require('expect.js');
import Color from '../common/Color.js';


const getColor = () => {
    const color = new Color({ colorCode: '#000000' });
    color.getRgb();
    color.getHsv();
    return color;
};

describe('Color', () => {

    describe('#getColorCode', () => {
        it('getColorCode - 1', () => expect(new Color({ colorCode: '#97b3ed' }).getColorCode()).to.be('#97B3ED'));
        it('getColorCode - 2', () => expect(new Color({ rgb: { r: 151, g: 179, b: 237 } }).getColorCode()).to.be('#97B3ED'));
        it('getColorCode - 3', () => expect(new Color({ hsv: { h: 220, s: 36, v: 93 } }).getColorCode()).to.be('#98B4ED'));
    });

    describe('#getRgb', () => {
        it('getRgb - 1', () => expect(new Color({ colorCode: '#97b3ed' }).getRgb()).to.eql({ r: 151, g: 179, b: 237 }));
        it('getRgb - 2', () => expect(new Color({ rgb: { r: 151, g: 179, b: 237 } }).getRgb()).to.eql({ r: 151, g: 179, b: 237 }));
        it('getRgb - 3', () => expect(new Color({ hsv: { h: 220, s: 36, v: 93 } }).getRgb()).to.eql({ r: 152, g: 180, b: 237 }));
    });

    describe('#getHsv', () => {
        it('getHsv - 1', () => expect(new Color({ colorCode: '#97b3ed' }).getHsv()).to.eql({ h: 220, s: 36, v: 93 }));
        it('getHsv - 2', () => expect(new Color({ rgb: { r: 151, g: 179, b: 237 } }).getHsv()).to.eql({ h: 220, s: 36, v: 93 }));
        it('getHsv - 3', () => expect(new Color({ hsv: { h: 220, s: 36, v: 93 } }).getHsv()).to.eql({ h: 220, s: 36, v: 93 }));
    });

    describe('#setColorCode', () => {

        it('setColorCode - 1', () => {
            const color = getColor();
            color.setColorCode('#97b3ed');
            expect(color.getColorCode()).to.be('#97B3ED');
        });

        it('setColorCode - 2', () => {
            const color = getColor();
            color.setColorCode('#97b3ed');
            expect(color.getRgb()).to.eql({ r: 151, g: 179, b: 237 });
        });

        it('setColorCode - 3', () => {
            const color = getColor();
            color.setColorCode('#97b3ed');
            expect(color.getHsv()).to.eql({ h: 220, s: 36, v: 93 });
        });
    });

    describe('#setRgb', () => {

        it('setRgb - 1', () => {
            const color = getColor();
            color.setRgb(151, 179, 237);
            expect(color.getColorCode()).to.be('#97B3ED');
        });

        it('setRgb - 2', () => {
            const color = getColor();
            color.setRgb(151, 179, 237);
            expect(color.getRgb()).to.eql({ r: 151, g: 179, b: 237 });
        });

        it('setRgb - 3', () => {
            const color = getColor();
            color.setRgb(151, 179, 237);
            expect(color.getHsv()).to.eql({ h: 220, s: 36, v: 93 });
        });
    });

    describe('#setHsv', () => {

        it('setHsv - 1', () => {
            const color = getColor();
            color.setHsv(220, 36, 93);
            expect(color.getColorCode()).to.be('#98B4ED');
        });

        it('setHsv - 2', () => {
            const color = getColor();
            color.setHsv(220, 36, 93);
            expect(color.getRgb()).to.eql({ r: 152, g: 180, b: 237 });
        });

        it('setHsv - 3', () => {
            const color = getColor();
            color.setHsv(220, 36, 93);
            expect(color.getHsv()).to.eql({ h: 220, s: 36, v: 93 });
        });
    });

    describe('#calcLuminance', () => {

        it('calcLuminance - 1', () => {
            const color = getColor();
            color.setRgb(198, 176, 214);
            const expected = 0.4791147426373934;
            const torelance = 0.0000001;
            expect(color.calcLuminance()).to.within(expected -  torelance, expected + torelance);
        });
    });

    describe('#equals', () => {

        it('equals - 1', () => {
            const color1 = getColor();
            const color2 = getColor();
            color2.setColorCode('#FFFFFF');
            expect(color1.equals(undefined)).to.not.be.ok();
            expect(color1.equals({})).to.not.be.ok();
            expect(color1.equals(getColor())).to.be.ok();
            expect(color1.equals(color2)).to.not.be.ok();
        });
    });
});
