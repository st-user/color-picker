
import ContrastRatioCalculator from './ContrastRatioCalculator.js';
import HsvRgbConverter from './HsvRgbConverter.js';

const ContrastRatioAutoExtractionWorker = (() => {

  const avg = (arr) => {
    return arr.reduce((a, b) => a + b) / arr.length;
  };

  const inRange = (val, range) => {
    return range[0] <= val && val <= range[1];
  };

  const decToR = dec => dec >> 16;
  const decToG = dec => (dec >> 8) & 255;
  const decToB = dec => dec & 255;

  return {

    extractHighestContrastRatios: message => {

      const condition = message.condition;
      const targetColors = message.targetColors;

      const targetRange = condition.targetRange;
      const numberOfResults = condition.numberOfResults;
      const hueRange = condition.hueRange;
      const saturationRange = condition.saturationRange;
      const valueRange = condition.valueRange;
      const contrastRatioRange = condition.contrastRatioRange;

      const resultArray = [];
      let currentMin = message.currentMinScore;
      const targetColorLuminances = targetColors.map(
        tc => ContrastRatioCalculator.calcLuminance(tc.r, tc.g, tc.b)
      );

      for (let colorCodeCount = targetRange[0]; colorCodeCount < targetRange[1]; colorCodeCount++) {

        const r_i = decToR(colorCodeCount),
              g_i = decToG(colorCodeCount),
              b_i = decToB(colorCodeCount);

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
