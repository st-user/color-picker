import ContrastRatioCalculator from '../contrast-ratio/ContrastRatioCalculator.js';

/*globals assertFuzzyEquals */
const ContrastRatioCalculatorTest = (() => {

    const calcRatio = (r1, g1, b1, r2, g2, b2) => {
        const l1 = ContrastRatioCalculator.calcLuminance(r1, g1, b1);
        const l2 = ContrastRatioCalculator.calcLuminance(r2, g2, b2);
        console.log(`l1:: ${l1} - l2:: ${l2}`);
        return ContrastRatioCalculator.calcContrastRatio(
            l1,
            l2
        );
    };

    return () => {

        (() => {

            assertFuzzyEquals(
                1,
                calcRatio(0, 0, 0, 0, 0, 0, 0),
                0,
                'Ratio - black vs black'
            );

            assertFuzzyEquals(
                21,
                calcRatio(255, 255, 255, 0, 0, 0),
                0,
                'Ratio - white vs black'
            );

            assertFuzzyEquals(
                21,
                calcRatio(0, 0, 0, 255, 255, 255),
                0,
                'Ratio - black vs white'
            );

            assertFuzzyEquals(
                1,
                calcRatio(255, 255, 255, 255, 255, 255),
                0,
                'Ratio - white vs white'
            );

            assertFuzzyEquals(
                1.28,
                calcRatio(95, 179, 123, 198, 176, 214),
                0.01,
                'Ratio - #5FB37B vs #C6B0D6'
            );

            assertFuzzyEquals(
                0.3610315572337403,
                ContrastRatioCalculator.calcLuminance(95, 179, 123),
                0.0000001,
                'Luminance - #5FB37B'
            );

            assertFuzzyEquals(
                0.4791147426373934,
                ContrastRatioCalculator.calcLuminance(198, 176, 214),
                0.0000001,
                'Luminance - #C6B0D6'
            );

        })();


    };
})();

export default ContrastRatioCalculatorTest;
