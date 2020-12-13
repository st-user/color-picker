/*globals require */
/*globals describe */
/*globals it */
const expect = require('expect.js');
import RgbUtil from '../common/RgbUtil.js';

describe('RgbUtil', () => {

    describe('#decToR,G,B', () => {

        it('decToR,G,B - 1', () => expect(RgbUtil.decToR(250)).to.be(0));
        it('decToR,G,B - 2', () => expect(RgbUtil.decToG(250)).to.be(0));
        it('decToR,G,B - 3', () => expect(RgbUtil.decToB(250)).to.be(250));
        it('decToR,G,B - 4', () => expect(RgbUtil.decToR(255)).to.be(0));
        it('decToR,G,B - 5', () => expect(RgbUtil.decToG(255)).to.be(0));
        it('decToR,G,B - 6', () => expect(RgbUtil.decToB(255)).to.be(255));
        it('decToR,G,B - 7', () => expect(RgbUtil.decToR(255 + 1)).to.be(0));
        it('decToR,G,B - 8', () => expect(RgbUtil.decToG(255 + 1)).to.be(1));
        it('decToR,G,B - 9', () => expect(RgbUtil.decToB(255 + 1)).to.be(0));
        it('decToR,G,B - 10', () => expect(RgbUtil.decToR(256 * 256 - 1)).to.be(0));
        it('decToR,G,B - 11', () => expect(RgbUtil.decToG(256 * 256 - 1)).to.be(255));
        it('decToR,G,B - 12', () => expect(RgbUtil.decToB(256 * 256 - 1)).to.be(255));
        it('decToR,G,B - 13', () => expect(RgbUtil.decToR(256 * 256)).to.be(1));
        it('decToR,G,B - 14', () => expect(RgbUtil.decToG(256 * 256)).to.be(0));
        it('decToR,G,B - 15', () => expect(RgbUtil.decToB(256 * 256)).to.be(0));
        it('decToR,G,B - 16', () => expect(RgbUtil.decToR(256 * 256 * 256 - 1)).to.be(255));
        it('decToR,G,B - 17', () => expect(RgbUtil.decToG(256 * 256 * 256 - 1)).to.be(255));
        it('decToR,G,B - 18', () => expect(RgbUtil.decToB(256 * 256 * 256 - 1)).to.be(255));

        const value = 97 * (256 * 256) + 60 * 256 + 72;
        it('decToR,G,B - 19', () => expect(RgbUtil.decToR(value)).to.be(97));
        it('decToR,G,B - 20', () => expect(RgbUtil.decToG(value)).to.be(60));
        it('decToR,G,B - 21', () => expect(RgbUtil.decToB(value)).to.be(72));

    });

    describe('#divideSRGBSpace', () => {

        const acutals = RgbUtil.divideSRGBSpace(1000);

        it('divideSRGBSpace - 1', () => expect(acutals.length).to.be(1000));
        it('divideSRGBSpace - 2', () => expect(acutals[0][0]).to.be(0));
        it('divideSRGBSpace - 3', () => expect(acutals[0][1]).to.be(16778));
        it('divideSRGBSpace - 4', () => expect(acutals[1][0]).to.be(16778));
        it('divideSRGBSpace - 5', () => expect(acutals[1000 - 1][0]).to.be(16778 * 999));
        it('divideSRGBSpace - 6', () => expect(acutals[1000 - 1][1]).to.be(256 * 256 * 256));

    });
});
