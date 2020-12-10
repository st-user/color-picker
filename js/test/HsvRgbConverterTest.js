import HsvRgbConverter from '../HsvRgbConverter.js';

const HsvRgbConverterTest = (() => {
    return () => {


        const assertRgb = (expected, actual) => {
            assertEquals(expected.r, actual.r);
            assertEquals(expected.g, actual.g);
            assertEquals(expected.b, actual.b);
        };

        const doAssertHsvConvertion = (r, g, b, h, s, v) => {
            assertRgb({ r: r, g: g, b: b }, HsvRgbConverter.hsvToRgb(h, s, v));
        };

        const assertHsv = (expected, actual) => {
            assertEquals(expected.h, actual.h);
            assertEquals(expected.s, actual.s);
            assertEquals(expected.v, actual.v);
        };

        const doAssertRgbConvertion = (h, s, v, r, g, b) => {
            assertHsv({ h: h, s: s, v: v }, HsvRgbConverter.rgbToHsv(r, g, b));
        };

        //https://www.rapidtables.com/convert/color/hsv-to-rgb.html
        doAssertHsvConvertion(0, 0, 0,   0, 0, 0);
        doAssertHsvConvertion(255, 255, 255,   0, 0, 1);

        doAssertHsvConvertion(255, 0, 0,   0, 1, 1);
        doAssertHsvConvertion(0, 255, 0,   120, 1, 1);
        doAssertHsvConvertion(0, 0, 255,   240, 1, 1);

        doAssertHsvConvertion(255, 255, 0,   60, 1, 1);
        doAssertHsvConvertion(0, 255, 255,   180, 1, 1);
        doAssertHsvConvertion(255, 0, 255,   300, 1, 1);

        doAssertHsvConvertion(191, 191, 191,   0, 0, 0.75);
        doAssertHsvConvertion(128, 128, 128,   0, 0, 0.5);

        doAssertHsvConvertion(128, 0, 0,   0, 1, 0.5);
        doAssertHsvConvertion(128, 128, 0,   60, 1, 0.5);
        doAssertHsvConvertion(0, 128, 0,   120, 1, 0.5);
        doAssertHsvConvertion(128, 0, 128,   300, 1, 0.5);
        doAssertHsvConvertion(0, 128, 128,   180, 1, 0.5);
        doAssertHsvConvertion(0, 0, 128,   240, 1, 0.5);

        //https://www.rapidtables.com/convert/color/rgb-to-hsv.html
        doAssertRgbConvertion(0, 0, 0,  0, 0, 0);
        doAssertRgbConvertion(0, 0, 100,  255, 255, 255);

        doAssertRgbConvertion(0, 100, 100,  255, 0, 0);
        doAssertRgbConvertion(120, 100, 100,  0, 255, 0);
        doAssertRgbConvertion(240, 100, 100,  0, 0, 255);

        doAssertRgbConvertion(60, 100, 100,  255, 255, 0);
        doAssertRgbConvertion(180, 100, 100,  0, 255, 255);
        doAssertRgbConvertion(300, 100, 100,  255, 0, 255);

        doAssertRgbConvertion(0, 0, 75,  191, 191, 191);
        doAssertRgbConvertion(0, 0, 50,  128, 128, 128);

        doAssertRgbConvertion(0, 100, 50,  128, 0, 0);
        doAssertRgbConvertion(60, 100, 50,  128, 128, 0);
        doAssertRgbConvertion(120, 100, 50,  0, 128, 0);
        doAssertRgbConvertion(300, 100, 50,  128, 0, 128);
        doAssertRgbConvertion(180, 100, 50,  0, 128, 128);
        doAssertRgbConvertion(240, 100, 50,  0, 0, 128);




    };
})();

export default HsvRgbConverterTest;
