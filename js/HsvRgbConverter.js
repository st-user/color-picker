const HsvRgbConverter = (() => {

  return {

    rgbToHsv: (r, g, b) => {

      const _r = r / 255;
      const _g = g / 255;
      const _b = b / 255;
      const c_max = Math.max(_r, _g, _b);
      const c_min = Math.min(_r, _g, _b);
      const delta = c_max - c_min;

      let hue;
      if (delta === 0) {
        hue = 0;
      } else if (_r === c_max) {
        hue = 60 * ((_g - _b) / delta % 6);
      } else if (_g === c_max) {
        hue = 60 * ((_b - _r) / delta + 2);
      } else {
        hue = 60 * ((_r - _g) / delta + 4);
      }
      if (hue < 0) {
        hue = 360 + hue;
      }

      let saturation;
      if (c_max === 0) {
        saturation = 0;
      } else {
        saturation = delta / c_max;
      }

      let value = c_max;

      return {
        h: Math.round(hue),
        s: Math.round(saturation * 100),
        v: Math.round(value * 100)
      };
    },

    hsvToRgb: (h, s, v) => {
      const c = v * s;
      const x = c * (1 - Math.abs(h / 60 % 2 - 1));
      const m = v - c;

      let _r, _g, _b;
      if (0 <= h && h < 60) {
        _r = c;
        _g = x;
        _b = 0;
      }
      if (60 <= h && h < 120) {
        _r = x;
        _g = c;
        _b = 0;
      }
      if (120 <= h && h < 180) {
        _r = 0;
        _g = c;
        _b = x;
      }
      if (180 <= h && h < 240) {
        _r = 0;
        _g = x;
        _b = c;
      }
      if (240 <= h && h < 300) {
        _r = x;
        _g = 0;
        _b = c;
      }
      if (300 <= h && h < 360) {
        _r = c;
        _g = 0;
        _b = x;
      }

      return {
        r: Math.round((_r + m) * 255),
        g: Math.round((_g + m) * 255),
        b: Math.round((_b + m) * 255)
      };
    }


  }


})();

export default HsvRgbConverter;
