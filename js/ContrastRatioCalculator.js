const ContrastRatioCalculator = (() => {

  const check = _sRGB_value => {
    if (_sRGB_value < 0 || 255 < _sRGB_value) {
      throw `Invalid Value ${_sRGB_value}`;
    }
  };

  const calc = sRGB_value => {
    if (sRGB_value <= 0.03928) {
      return sRGB_value / 12.92;
    } else {
      return Math.pow(
                    ((sRGB_value + 0.055) / 1.055),
                    2.4
                  );
    }
  };

  return {

    calcLuminance: (_sRGB_r, _sRGB_g, _sRGB_b) => {

      check(_sRGB_r);
      check(_sRGB_g);
      check(_sRGB_b);

      const sRGB_r = _sRGB_r / 255,
            sRGB_g = _sRGB_g / 255,
            sRGB_b = _sRGB_b / 255;

      const r = calc(sRGB_r),
            g = calc(sRGB_g),
            b = calc(sRGB_b);

      return 0.2126 * r + 0.7152 * g + 0.0722 * b;
    },

    calcContrastRatio: (l1, l2) => {

      const nom = Math.max(l1, l2) + 0.05;
      const denom = Math.min(l1, l2) + 0.05;

      return nom / denom;
    },

    checkSuccessCriteriaNormalAA: ratio => {
      return 4.5 <= ratio;
    },

    checkSuccessCriteriaNormalAAA: ratio => {
      return 7 <= ratio;
    },

    checkSuccessCriteriaLargeAA: ratio => {
      return 3 <= ratio;
    },

    checkSuccessCriteriaLargeAAA: ratio => {
      return 4.5 <= ratio;
    },
  }

})();

export default ContrastRatioCalculator;
