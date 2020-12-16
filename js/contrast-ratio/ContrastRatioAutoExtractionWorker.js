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

        calcContrastRatioScore: message => {

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

                        const rgb = HsvRgbConverter.hsvToRgb(hueIndex % 360, saturationIndex / 100, valueIndex / 100);

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
                                continue;
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
