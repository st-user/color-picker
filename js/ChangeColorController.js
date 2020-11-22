import HsvRgbConverter from "./color.js";

const toHex = d => {
  const val = Number(d).toString(16);
  if (val.length === 1) {
    return '0' + val;
  }
  return val;
};
const toNumber = hex => parseInt(hex, 16);

const InputChecker = (() => {

  const checkInputRange = (input, item, min, max) => {
    const reg = /^\d+$/;
    if (reg.test(input) && min <= input && input <= max) {
      return true;
    }
    alert(`${item}は${min}以上、${max}以下の整数で入力してください`);
    return false;
  };

  const checkColorCodeRgb =  value => {
    if (isNaN(value)) {
      alert('入力されたカラーコードが不正です');
      return false;
    }
    return true;
  };

  return {

    checkColorCodeRgbAll: (r, g, b) => {
      return checkColorCodeRgb(r)
        && checkColorCodeRgb(g)
        && checkColorCodeRgb(b);
    },

    checkRgbInputRange: (input) => {
      return checkInputRange(input, 'R、G、B', 0, 255);
    },

    checkHueInputRange: (input) => {
      return checkInputRange(input, 'H', 0, 360);
    },

    checkSvInputRange: (input) => {
      return checkInputRange(input, 'S、V', 0, 100);
    }
  }
})();



export default class ChangeColorController {

  #$viewColor;
  #$rgbColorCode;

  #$rgbSilder_r;
  #$rgbText_r;
  #$rgbSilder_g;
  #$rgbText_g;
  #$rgbSilder_b;
  #$rgbText_b;

  #$hsvSilder_h;
  #$hsvText_h;
  #$hsvSilder_s;
  #$hsvText_s;
  #$hsvSilder_v;
  #$hsvText_v;

  constructor() {
    this.#$viewColor = document.querySelector('#viewColor');

    this.#$rgbColorCode = document.querySelector('#rgbColorCode');
    this.#$rgbSilder_r = document.querySelector('#rgbSilder_r');
    this.#$rgbText_r = document.querySelector('#rgbText_r');
    this.#$rgbSilder_g = document.querySelector('#rgbSilder_g');
    this.#$rgbText_g = document.querySelector('#rgbText_g');
    this.#$rgbSilder_b = document.querySelector('#rgbSilder_b');
    this.#$rgbText_b = document.querySelector('#rgbText_b');

    this.#$hsvSilder_h = document.querySelector('#hsvSilder_h');
    this.#$hsvText_h = document.querySelector('#hsvText_h');
    this.#$hsvSilder_s = document.querySelector('#hsvSilder_s');
    this.#$hsvText_s = document.querySelector('#hsvText_s');
    this.#$hsvSilder_v = document.querySelector('#hsvSilder_v');
    this.#$hsvText_v = document.querySelector('#hsvText_v');
  }

  setUpEvents() {

    const setHandlerOnRgbSilderChange = element => {
      element.addEventListener('change', () => this.#setColorValuesFromRgbSilder());
    };

    const setHandlerOnRgbTextChange = element => {
      element.addEventListener('change', () => {
        if(this.#checkRgbInputRangeAll()) {
          this.#setColorValuesFromRgbText()
        } else {
          this.#setColorValuesFromRgbSilder();
        }
      });
    };

    const setHandlerOnColorCodeChange = element => {
      element.addEventListener('change', () => {

        const newCode = this.#$rgbColorCode.value;
        const r = toNumber(newCode.substring(1, 3));
        const g = toNumber(newCode.substring(3, 5));
        const b = toNumber(newCode.substring(5, 7));

        if(InputChecker.checkColorCodeRgbAll(r, g, b)) {
          this.setColorValuesFromRgb(r, g, b);
        } else {
          this.#setColorValuesFromRgbSilder();
        }
      });
    };

    const setHandlerOnHsvSilderChange = element => {
      element.addEventListener('change', () => this.#setColorValuesFromHsvSilder());
    };

    const setHandlerOnHsvTextChange = element => {
      element.addEventListener('change', () => {
        if (this.#checkHsvInputRangeAll()) {
          this.#setColorValuesFromHsvText();
        } else {
          this.#setColorValuesFromHsvSilder();
        }
      });
    };

    setHandlerOnRgbSilderChange(this.#$rgbSilder_r);
    setHandlerOnRgbSilderChange(this.#$rgbSilder_g);
    setHandlerOnRgbSilderChange(this.#$rgbSilder_b);

    setHandlerOnRgbTextChange(this.#$rgbText_r);
    setHandlerOnRgbTextChange(this.#$rgbText_g);
    setHandlerOnRgbTextChange(this.#$rgbText_b);

    setHandlerOnColorCodeChange(this.#$rgbColorCode);

    setHandlerOnHsvSilderChange(this.#$hsvSilder_h);
    setHandlerOnHsvSilderChange(this.#$hsvSilder_s);
    setHandlerOnHsvSilderChange(this.#$hsvSilder_v);

    setHandlerOnHsvTextChange(this.#$hsvText_h);
    setHandlerOnHsvTextChange(this.#$hsvText_s);
    setHandlerOnHsvTextChange(this.#$hsvText_v);

    this.setColorValuesFromRgb(255, 255, 255);
  }

  setColorValuesFromRgb(r, g, b) {
    this.#setRgbColorToRgbSilder(r, g, b);
    const hsv = HsvRgbConverter.rgbToHsv(r, g, b);
    this.#setHsvColorToHsvSilder(hsv.h, hsv.s, hsv.v);
  }

  getSliders() {
    return [
      this.#$rgbSilder_r, this.#$rgbSilder_g, this.#$rgbSilder_b,
      this.#$hsvSilder_h, this.#$hsvSilder_s, this.#$hsvSilder_v,
    ];
  }

  #setColorValuesFromRgbSilder() {
    this.setColorValuesFromRgb(
      this.#$rgbSilder_r.value, this.#$rgbSilder_g.value, this.#$rgbSilder_b.value
    );
  }

  #setColorValuesFromRgbText() {
    this.setColorValuesFromRgb(
      this.#$rgbText_r.value, this.#$rgbText_g.value, this.#$rgbText_b.value
    );
  }

  #setColorValuesFromHsvSilder() {
    this.#setColorValuesFromHsv(
      this.#$hsvSilder_h.value, this.#$hsvSilder_s.value, this.#$hsvSilder_v.value
    );
  }

  #setColorValuesFromHsvText() {
    this.#setColorValuesFromHsv(
      this.#$hsvText_h.value, this.#$hsvText_s.value, this.#$hsvText_v.value
    );
  }

  #checkRgbInputRangeAll() {
    return InputChecker.checkRgbInputRange(this.#$rgbText_r.value)
    && InputChecker.checkRgbInputRange(this.#$rgbText_g.value)
    && InputChecker.checkRgbInputRange(this.#$rgbText_b.value);
  }

  #checkHsvInputRangeAll() {
    return InputChecker.checkHueInputRange(this.#$hsvText_h.value)
    && InputChecker.checkSvInputRange(this.#$hsvText_s.value)
    && InputChecker.checkSvInputRange(this.#$hsvText_v.value);
  }

  #setRgbColorToRgbSilder(r, g, b) {

    const newColorCode = `#${toHex(r)}${toHex(g)}${toHex(b)}`.toUpperCase();
    this.#$rgbColorCode.value = newColorCode;
    this.#$viewColor.style.backgroundColor = newColorCode;

    this.#$rgbSilder_r.value = r;
    this.#$rgbText_r.value = r;
    this.#$rgbSilder_g.value = g;
    this.#$rgbText_g.value = g;
    this.#$rgbSilder_b.value = b;
    this.#$rgbText_b.value = b;
  }

  #setHsvColorToHsvSilder(h, s, v) {
    this.#$hsvSilder_h.value = h;
    this.#$hsvText_h.value = h;
    this.#$hsvSilder_s.value = s;
    this.#$hsvText_s.value = s;
    this.#$hsvSilder_v.value = v;
    this.#$hsvText_v.value = v;
  }

  #setColorValuesFromHsv(h, s, v) {
    this.#setHsvColorToHsvSilder(h, s, v);
    const rgb = HsvRgbConverter.hsvToRgb(h % 360, s / 100, v / 100);
    this.#setRgbColorToRgbSilder(rgb.r, rgb.g, rgb.b);
  }

}
