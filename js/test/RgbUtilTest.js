import RgbUtil from '../RgbUtil.js';

/*globals assertEquals */
const RgbUtilTest = (() => {
    return () => {

        (() => {

            assertEquals(0, RgbUtil.decToR(250), 'RgbUtil.decToR');
            assertEquals(0, RgbUtil.decToG(250), 'RgbUtil.decToG');
            assertEquals(250, RgbUtil.decToB(250), 'RgbUtil.decToB');

            assertEquals(0, RgbUtil.decToR(255), 'RgbUtil.decToR');
            assertEquals(0, RgbUtil.decToG(255), 'RgbUtil.decToG');
            assertEquals(255, RgbUtil.decToB(255), 'RgbUtil.decToB');

            assertEquals(0, RgbUtil.decToR(255 + 1), 'RgbUtil.decToR');
            assertEquals(1, RgbUtil.decToG(255 + 1), 'RgbUtil.decToG');
            assertEquals(0, RgbUtil.decToB(255 + 1), 'RgbUtil.decToB');

            assertEquals(0, RgbUtil.decToR(256 * 256 - 1), 'RgbUtil.decToR');
            assertEquals(255, RgbUtil.decToG(256 * 256 - 1), 'RgbUtil.decToG');
            assertEquals(255, RgbUtil.decToB(256 * 256 - 1), 'RgbUtil.decToB');

            assertEquals(1, RgbUtil.decToR(256 * 256), 'RgbUtil.decToR');
            assertEquals(0, RgbUtil.decToG(256 * 256), 'RgbUtil.decToG');
            assertEquals(0, RgbUtil.decToB(256 * 256), 'RgbUtil.decToB');

            assertEquals(255, RgbUtil.decToR(256 * 256 * 256 - 1), 'RgbUtil.decToR');
            assertEquals(255, RgbUtil.decToG(256 * 256 * 256 - 1), 'RgbUtil.decToG');
            assertEquals(255, RgbUtil.decToB(256 * 256 * 256 - 1), 'RgbUtil.decToB');

            const value = 97 * (256 * 256) + 60 * 256 + 72;
            assertEquals(97, RgbUtil.decToR(value), 'RgbUtil.decToR');
            assertEquals(60, RgbUtil.decToG(value), 'RgbUtil.decToG');
            assertEquals(72, RgbUtil.decToB(value), 'RgbUtil.decToB');


        })();


        (() => {

            const acutals = RgbUtil.divideSRGBSpace(1000);

            assertEquals(1000, acutals.length, 'RgbUtil.divideSRGBSpace - Check result count.');
            assertEquals(0, acutals[0][0], 'RgbUtil.divideSRGBSpace - Check range');
            assertEquals(16778, acutals[0][1], 'RgbUtil.divideSRGBSpace - Check range');
            assertEquals(16778, acutals[1][0], 'RgbUtil.divideSRGBSpace - Check range');
            assertEquals(16778 * 999, acutals[1000 - 1][0], 'RgbUtil.divideSRGBSpace - Check range');
            assertEquals(256 * 256 * 256, acutals[1000 - 1][1], 'RgbUtil.divideSRGBSpace - Check range');

        })();


    };
})();

export default RgbUtilTest;
