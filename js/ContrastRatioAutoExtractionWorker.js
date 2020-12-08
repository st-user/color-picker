
import ContrastRatioCalculator from './ContrastRatioCalculator.js';
import HsvRgbConverter from './HsvRgbConverter.js';

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
      const targetColors = message.targetColors;

      const targetRange_R = condition.targetRange_R;
      const numberOfResults = condition.numberOfResults;
      const hueRange = condition.hueRange;
      const saturationRange = condition.saturationRange;
      const valueRange = condition.valueRange;
      const contrastRatioRange = condition.contrastRatioRange;

      const resultArray = [];
      let currentMin = -Infinity;

      for (let r_i = targetRange_R[0]; r_i <= targetRange_R[1]; r_i++) {
        for (let g_i = 0; g_i < 256; g_i++) {
          for (let b_i = 0; b_i < 256; b_i++) {

            const hsv = HsvRgbConverter.rgbToHsv(r_i, g_i, b_i);
            if (!inRange(hsv.h, hueRange) || !inRange(hsv.s, saturationRange) || !inRange(hsv.v, valueRange)) {
              continue;
            }

            const ratios =   targetColors.map(
              tc => ContrastRatioCalculator.calcContrastRatio(
                ContrastRatioCalculator.calcLuminance(r_i, g_i, b_i),
                ContrastRatioCalculator.calcLuminance(tc.r, tc.g, tc.b)
              )
            );

            let rationNotInRange = false;
            for (const ratio of ratios) {
              if (!inRange(ratio, contrastRatioRange)) {
                rationNotInRange = true;
                continue;
              }
            }
            if (rationNotInRange) {
              continue;
            }

            const ratioAvg = avg(ratios);
            if (ratioAvg < currentMin) {
              continue;
            }

            if (resultArray.length < numberOfResults) {
              resultArray.push({ avg: ratioAvg, ratios: ratios, r: r_i, g: g_i, b: b_i });
            } else {
              let minIndex = -1;
              let current = Infinity;
              for (let i = 0; i < resultArray.length; i++) {
                const temp = avg(resultArray[i].ratios);
                if (temp < current) {
                  current = temp;
                  currentMin = temp;
                  minIndex = i;
                }
              }
              if (current < ratioAvg) {
                  resultArray[minIndex] = { avg: ratioAvg, ratios: ratios, r: r_i, g: g_i, b: b_i };
              }
            }

          }
        }
      }

      return resultArray;

    }
  };


})();

export default ContrastRatioAutoExtractionWorker;
