/*globals require */
/*globals describe */
/*globals it */
const expect = require('expect.js');
import ColorModel from '../js/common/ColorModel.js';
import Color from '../js/common/Color.js';

const getColorModel = () => {
    return new ColorModel('test', new Color(
        { colorCode: '#FFFFFF' }
    ));
};

const messageForColorCode = '入力されたカラーコードが不正です';
const messageForRgb = 'R, G, Bは0以上、255以下の整数で入力してください';
const messageForHue = 'Hは0以上、360以下の整数で入力してください';
const messageForSv = 'S, Vは0以上、100以下の整数で入力してください';

describe('ColorModel', () => {

    describe('#setColorCode', () => {
        it('変換可能な文字列の場合、空文字が返ること', () => {
            expect(getColorModel().setColorCode('#FFFFFF')).to.be('');
        });
        it('変換不可能な文字列の場合errorMessageが返ること - 1', () => {
            expect(getColorModel().setColorCode('#GFFFFF')).to.be(messageForColorCode);
        });
        it('変換不可能な文字列の場合errorMessageが返ること - 2', () => {
            expect(getColorModel().setColorCode('#FFGFFF')).to.be(messageForColorCode);
        });
        it('変換不可能な文字列の場合errorMessageが返ること - 3', () => {
            expect(getColorModel().setColorCode('#FFFFGF')).to.be(messageForColorCode);
        });
    });

    describe('#setRgbFromString', () => {
        it('可能な範囲の場合、空文字が返ること - 上限', () => {
            expect(getColorModel().setRgbFromString('255', '255', '255')).to.be('');
        });

        it('可能な範囲の場合、空文字が返ること - 下限', () => {
            expect(getColorModel().setRgbFromString('0', '0', '0')).to.be('');
        });

        it('正の整数でない場合errorMessageが返ること - R', () => {
            expect(getColorModel().setRgbFromString(undefined, '0', '0')).to.be(messageForRgb);
            expect(getColorModel().setRgbFromString('', '0', '0')).to.be(messageForRgb);
            expect(getColorModel().setRgbFromString('a', '0', '0')).to.be(messageForRgb);
            expect(getColorModel().setRgbFromString('1.1', '0', '0')).to.be(messageForRgb);
            expect(getColorModel().setRgbFromString('-1', '0', '0')).to.be(messageForRgb);
        });

        it('範囲外の正の整数の場合errorMessageが返ること - R', () => {
            expect(getColorModel().setRgbFromString('256', '0', '0')).to.be(messageForRgb);
        });

        it('正の整数でない場合errorMessageが返ること - G', () => {
            expect(getColorModel().setRgbFromString('0', undefined, '0')).to.be(messageForRgb);
            expect(getColorModel().setRgbFromString('0', '', '0')).to.be(messageForRgb);
            expect(getColorModel().setRgbFromString('0', 'a', '0')).to.be(messageForRgb);
            expect(getColorModel().setRgbFromString('0', '1.1', '0')).to.be(messageForRgb);
            expect(getColorModel().setRgbFromString('0', '-1', '0')).to.be(messageForRgb);
        });

        it('範囲外の正の整数の場合errorMessageが返ること - G', () => {
            expect(getColorModel().setRgbFromString('0', '256', '0')).to.be(messageForRgb);
        });

        it('正の整数でない場合errorMessageが返ること - B', () => {
            expect(getColorModel().setRgbFromString('0', '0', undefined)).to.be(messageForRgb);
            expect(getColorModel().setRgbFromString('0', '0', '')).to.be(messageForRgb);
            expect(getColorModel().setRgbFromString('0', '0', 'a')).to.be(messageForRgb);
            expect(getColorModel().setRgbFromString('0', '0', '1.1')).to.be(messageForRgb);
            expect(getColorModel().setRgbFromString('0', '0', '-1')).to.be(messageForRgb);
        });

        it('範囲外の正の整数の場合errorMessageが返ること - B', () => {
            expect(getColorModel().setRgbFromString('0', '0', '256')).to.be(messageForRgb);
        });
    });


    describe('#setHsvFromString', () => {
        it('可能な範囲の場合、空文字が返ること - 上限', () => {
            expect(getColorModel().setHsvFromString('360', '100', '100')).to.be('');
        });

        it('可能な範囲の場合、空文字が返ること - 下限', () => {
            expect(getColorModel().setHsvFromString('0', '0', '0')).to.be('');
        });

        it('正の整数でない場合errorMessageが返ること - H', () => {
            expect(getColorModel().setHsvFromString(undefined, '0', '0')).to.be(messageForHue);
            expect(getColorModel().setHsvFromString('', '0', '0')).to.be(messageForHue);
            expect(getColorModel().setHsvFromString('a', '0', '0')).to.be(messageForHue);
            expect(getColorModel().setHsvFromString('1.1', '0', '0')).to.be(messageForHue);
            expect(getColorModel().setHsvFromString('-1', '0', '0')).to.be(messageForHue);
        });

        it('範囲外の正の整数の場合errorMessageが返ること - H', () => {
            expect(getColorModel().setHsvFromString('361', '0', '0')).to.be(messageForHue);
        });

        it('正の整数でない場合errorMessageが返ること - S', () => {
            expect(getColorModel().setHsvFromString('0', undefined, '0')).to.be(messageForSv);
            expect(getColorModel().setHsvFromString('0', '', '0')).to.be(messageForSv);
            expect(getColorModel().setHsvFromString('0', 'a', '0')).to.be(messageForSv);
            expect(getColorModel().setHsvFromString('0', '1.1', '0')).to.be(messageForSv);
            expect(getColorModel().setHsvFromString('0', '-1', '0')).to.be(messageForSv);
        });

        it('範囲外の正の整数の場合errorMessageが返ること - S', () => {
            expect(getColorModel().setHsvFromString('0', '101', '0')).to.be(messageForSv);
        });

        it('正の整数でない場合errorMessageが返ること - V', () => {
            expect(getColorModel().setHsvFromString('0', '0', undefined)).to.be(messageForSv);
            expect(getColorModel().setHsvFromString('0', '0', '')).to.be(messageForSv);
            expect(getColorModel().setHsvFromString('0', '0', 'a')).to.be(messageForSv);
            expect(getColorModel().setHsvFromString('0', '0', '1.1')).to.be(messageForSv);
            expect(getColorModel().setHsvFromString('0', '0', '-1')).to.be(messageForSv);
        });

        it('範囲外の正の整数の場合errorMessageが返ること - V', () => {
            expect(getColorModel().setHsvFromString('0', '0', '101')).to.be(messageForSv);
        });
    });
});
