import ContrastRatioCalculator from './ContrastRatioCalculator.js';
import HsvRgbConverter from '../common/HsvRgbConverter.js';
import RgbUtil from '../common/RgbUtil.js';

const ContrastRatioAutoExtractionWorker = (() => {

    const avg = (arr) => {
        return arr.reduce((a, b) => a + b) / arr.length;
    };

    const inRange = (val, range) => {
        return range[0] <= val && val <= range[1];
    };

    return {

        extractHighestContrastRatios: message => {

            const condition = message.condition;
            const targetColorLuminances = message.targetColorLuminances;

            const targetRange = condition.targetRange;
            const hueRange = condition.hueRange;
            const saturationRange = condition.saturationRange;
            const valueRange = condition.valueRange;
            const contrastRatioRange = condition.contrastRatioRange;

            const resultArray = [];
            let currentMin = message.currentMinScore;

            for (let colorCodeCount = targetRange[0]; colorCodeCount < targetRange[1]; colorCodeCount++) {

                const r_i = RgbUtil.decToR(colorCodeCount),
                    g_i = RgbUtil.decToG(colorCodeCount),
                    b_i = RgbUtil.decToB(colorCodeCount);

                const hsv = HsvRgbConverter.rgbToHsv(r_i, g_i, b_i);
                if (!inRange(hsv.h, hueRange) || !inRange(hsv.s, saturationRange) || !inRange(hsv.v, valueRange)) {
                    continue;
                }

                const ratios = targetColorLuminances.map(
                    targetColorLuminance => ContrastRatioCalculator.calcContrastRatio(
                        ContrastRatioCalculator.calcLuminance(r_i, g_i, b_i),
                        targetColorLuminance
                    )
                );

                let ratioNotInRange = false;
                for (const ratio of ratios) {
                    if (!inRange(ratio, contrastRatioRange)) {
                        ratioNotInRange = true;
                        continue;
                    }
                }
                if (ratioNotInRange) {
                    continue;
                }

                const ratioAvg = avg(ratios);
                if (ratioAvg < currentMin) {
                    continue;
                }

                resultArray.push({ avg: ratioAvg, r: r_i, g: g_i, b: b_i });
            }

            return resultArray;

        }
    };


})();

export default ContrastRatioAutoExtractionWorker;
