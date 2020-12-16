import ContrastRatioCalculator from './ContrastRatioCalculator.js';
import HsvRgbConverter from '../common/HsvRgbConverter.js';

const ContrastRatioAutoExtractionWorker = (() => {

    const avg = (arr) => {
        return arr.reduce((a, b) => a + b) / arr.length;
    };

    const inRange = (val, range) => {
        return range[0] <= val && val <= range[1];
    };

    return {

        calcContrastRatioScore: (message, hsvToRgbConverter) => {

            hsvToRgbConverter = hsvToRgbConverter || ((h, s, v) => HsvRgbConverter.hsvToRgb(h % 360, s / 100, v / 100));

            const condition = message.condition;
            const targetColorLuminances = message.targetColorLuminances;

            const targetHueRange = condition.targetHueRange;
            const hueDivisionCount = condition.hueDivisionCount;
            const hueCountOfEachDivision = 360 / hueDivisionCount;

            const selectedHueRange = condition.selectedHueRange;
            const selectedSaturationRange = condition.selectedSaturationRange;
            const saturationEndExclusive = selectedSaturationRange[1] + 1;
            const selectedValueRange = condition.selectedValueRange;
            const valueEndExclusive = selectedValueRange[1] + 1;
            const selectedContrastRatioRange = condition.selectedContrastRatioRange;

            const eachDivisionCurrentMax = {};
            const eachDivisionResult = {};

            for (let hueIndex = targetHueRange[0]; hueIndex < targetHueRange[1]; hueIndex++) {

                if (!inRange(hueIndex, selectedHueRange)) {
                    continue;
                }
                const divisionIndex = Math.floor(hueIndex / hueCountOfEachDivision);

                for (let saturationIndex = selectedSaturationRange[0]; saturationIndex < saturationEndExclusive; saturationIndex++) {
                    for (let valueIndex = selectedValueRange[0]; valueIndex < valueEndExclusive; valueIndex++) {

                        const rgb = hsvToRgbConverter(hueIndex, saturationIndex, valueIndex);

                        const ratios = targetColorLuminances.map(
                            targetColorLuminance => ContrastRatioCalculator.calcContrastRatio(
                                ContrastRatioCalculator.calcLuminance(rgb.r, rgb.g, rgb.b),
                                targetColorLuminance
                            )
                        );

                        let ratioNotInRange = false;
                        for (const ratio of ratios) {
                            if (!inRange(ratio, selectedContrastRatioRange)) {
                                ratioNotInRange = true;
                                break;
                            }
                        }

                        if (ratioNotInRange) {
                            continue;
                        }

                        const ratioAvg = avg(ratios);
                        const currentMax = eachDivisionCurrentMax[divisionIndex];
                        if (!currentMax || currentMax < ratioAvg) {
                            eachDivisionCurrentMax[divisionIndex] = ratioAvg;
                            eachDivisionResult[divisionIndex] = { avg: ratioAvg, r: rgb.r, g: rgb.g, b: rgb.b };
                        }
                    }
                }
            }

            return eachDivisionResult;

        }
    };


})();

export default ContrastRatioAutoExtractionWorker;
