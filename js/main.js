import HsvRgbConverter from "./color.js";

const Constans = {
  CANVAS_DEFAULT_WIDTH: 500,
  CANVAS_DEFAULT_HEIGHT: 500
};

class CanvasHandler {

  #$canvas;

  constructor() {
    const $canvas = document.querySelector('#imageData');

    $canvas.width = Constans.CANVAS_DEFAULT_WIDTH;
    $canvas.height = Constans.CANVAS_DEFAULT_HEIGHT;

    this.#$canvas = $canvas;
  }

  drawImageWithSpecificSize(image, width, height) {
    const $canvas = this.#$canvas;

    $canvas.width = width;
    $canvas.height = height;

    const ctx = $canvas.getContext('2d');
    ctx.clearRect(0, 0, width, height);
    ctx.drawImage(image, 0, 0, width, height);
  }

  extractRgb(currentEventX, currentEventY) {
    const $canvas = this.#$canvas;

    const canvasX = currentEventX - $canvas.offsetLeft;
    const canvasY = currentEventY - $canvas.offsetTop;

    const ctx = $canvas.getContext('2d');
    const imageData = ctx.getImageData(canvasX, canvasY, 1, 1);
    return imageData.data;
  }

  onMousedown(handler) {
    this.#$canvas.addEventListener('mousedown', handler);
  }

  onMousemove(handler) {
    this.#$canvas.addEventListener('mousemove', handler);
  }

  containsX(x) {
    const $canvas = this.#$canvas;

    const min = $canvas.offsetLeft;
    const max = min + $canvas.width;
    return min <= x && x <= max;
  }

  containsY(y) {
    const $canvas = this.#$canvas;

    const min = $canvas.offsetTop;
    const max = min + $canvas.height;
    return min <= y && y <= max;
  }
}


class ColorPointerCircles {

  #$circleBlack;
  #$circleWhite;

  constructor() {
    const $circleBlack = document.querySelector('#circleBlack');
    const $circleWhite = document.querySelector('#circleWhite');

    this.#$circleBlack = $circleBlack;
    this.#$circleWhite = $circleWhite;

  }

  show(currentEventX, currentEventY) {
    this.#showCircle(this.#$circleBlack, 10, currentEventX, currentEventY);
    this.#showCircle(this.#$circleWhite, 12, currentEventX, currentEventY);
  }

  hide() {
    this.#hideCircle(this.#$circleBlack);
    this.#hideCircle(this.#$circleWhite);
  }

  #showCircle(element, radius, x, y) {
    element.style.display = 'block';
    element.style.top = `${y - radius}px`;
    element.style.left = `${x - radius}px`;
  }

  #hideCircle(element) {
    element.style.display = 'none';
  }
}


class LoadedImageHolder {

  #$imageFile;
  #currentLoadedImage;

  constructor() {
    const $imageFile = document.querySelector('#imageFile');
    this.#$imageFile = $imageFile;
  }

  init(onload) {
    const currentLoadedImage = this.#currentLoadedImage;

    this.#$imageFile.addEventListener('change', e => {

      const fileData = e.target.files[0];
      const reader = new FileReader();

      reader.onerror = () => {
        alert('ファイルの読み込みに失敗しました');
      };

      reader.onload = () => {

        const loadedImage = reader.result;
        const image = new Image();
        image.src = loadedImage;

        image.onload = () => {
          this.#currentLoadedImage = image;
          this.consumeCurrentImageInfo(onload);
        };

      };
      reader.readAsDataURL(fileData);
    });
  }

  consumeCurrentImageInfo(consumer) {
    const wh = this.#calcWidthAndHeight();
    consumer(this.#currentLoadedImage, wh.width, wh.height);
  }


  #calcWidthAndHeight() {
    const currentLoadedImage = this.#currentLoadedImage;

    if (!currentLoadedImage) {
      return {
        width: Constans.CANVAS_DEFAULT_WIDTH,
        height: Constans.CANVAS_DEFAULT_HEIGHT
      };
    }

    const needsToResize = document.querySelector('input[name="needsToResize"]:checked').value;
    const originalImageWidth = currentLoadedImage.width;
    const originalImageHeight = currentLoadedImage.height;
    let imageWidth, imageHeight;

    if (needsToResize === "0") {
      const ratioX = Constans.CANVAS_DEFAULT_WIDTH / originalImageWidth;
      const ratioY = Constans.CANVAS_DEFAULT_HEIGHT / originalImageHeight;
      const resizeRatio = ratioX < ratioY ? ratioX : ratioY;

      imageWidth = originalImageWidth * resizeRatio;
      imageHeight = originalImageHeight * resizeRatio;

    } else {
      imageWidth = originalImageWidth;
      imageHeight = originalImageHeight;
    }

    return {
      width: imageWidth,
      height: imageHeight
    };
  }
}


class CurrentEventXY {

  #currentEventX;
  #currentEventY;

  #canvasHandler;

  constructor(canvasHandler) {
    this.#canvasHandler = canvasHandler;
  }

  x() {
    return this.#currentEventX;
  }

  y() {
    return this.#currentEventY;
  }

  exists() {
    return this.#currentEventX && this.#currentEventY;
  }

  set(xy) {
    if (xy.x) {
      this.#currentEventX = xy.x;
    }
    if (xy.y) {
      this.#currentEventY = xy.y;
    }
  }

  changeCurrentEventX(diff) {
    const currentEventX = this.#currentEventX;

    if (!currentEventX) {
      return false;
    }
    const newX = currentEventX + diff;
    if (this.#canvasHandler.containsX(newX)) {
      this.#currentEventX = newX;
      return true;
    }
    return false;
  }

  changeCurrentEventY(diff) {
    const currentEventY = this.#currentEventY;

    if (!currentEventY) {
      return false;
    }
    const newY = currentEventY + diff;
    if (this.#canvasHandler.containsY(newY)) {
      this.#currentEventY = newY;
      return true;
    }
    return false;
  }
}





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






class ChangeColorController {

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



export default function main() {

  const canvasHandler = new CanvasHandler();
  const colorPointerCircles = new ColorPointerCircles();
  const currentEventXY = new CurrentEventXY(canvasHandler);
  const loadedImageHolder = new LoadedImageHolder();
  const changeColorController = new ChangeColorController();

  const $needsToResize = document.querySelectorAll('input[name="needsToResize"]');

  /*
   * RGB, HSVのスライダー関係のイベントハンドラーの設定
   */
  changeColorController.setUpEvents();


  /*
   * 画像ファイル関係のイベントハンドラーの設定
   */
  const drawCurrentLoadedImage = (currentLoadedImage, imageWidth, imageHeight) => {

    canvasHandler.drawImageWithSpecificSize(
      currentLoadedImage, imageWidth, imageHeight
    );
    colorPointerCircles.hide();

  };

  loadedImageHolder.init(drawCurrentLoadedImage);

  $needsToResize.forEach(
    element => element.addEventListener("change",
      () => loadedImageHolder.consumeCurrentImageInfo(drawCurrentLoadedImage)
    )
  );



  /*
   * キーボード、マウス操作によるイメージの色取得関係のイベントハンドドラーの設定
   */
  let isControlKeyPressed, shouldPreventCircleFromMovingByArrow;
  const pickUpColorFromSelectedPx = () => {

    if (currentEventXY.exists()) {
      colorPointerCircles.show(currentEventXY.x(), currentEventXY.y());
      const rgbaData = canvasHandler.extractRgb(currentEventXY.x(), currentEventXY.y());
      changeColorController.setColorValuesFromRgb(rgbaData[0], rgbaData[1], rgbaData[2]);
    }

  };

  canvasHandler.onMousedown(event => {

    currentEventXY.set({
      x: event.pageX,
      y: event.pageY
    });
    pickUpColorFromSelectedPx();

  });

  canvasHandler.onMousemove(event => {

    if (!isControlKeyPressed) {
      return;
    }
    currentEventXY.set({
      x: event.pageX,
      y: event.pageY
    });
    pickUpColorFromSelectedPx();

  });

  document.addEventListener('keydown', event => {

    if (event.key === 'Control') {
      isControlKeyPressed = true;
    }

  });

  document.addEventListener('keydown', event => {

    if (shouldPreventCircleFromMovingByArrow) {
      return;
    }
    switch (event.key) {
      case "Down":
      case "ArrowDown":
        if (currentEventXY.changeCurrentEventY(1)) {
            pickUpColorFromSelectedPx();
        }
        break;
      case "Up":
      case "ArrowUp":
        if (currentEventXY.changeCurrentEventY(-1)) {
            pickUpColorFromSelectedPx();
        }
        break;
      case "Left":
      case "ArrowLeft":
        if (currentEventXY.changeCurrentEventX(-1)) {
            pickUpColorFromSelectedPx();
        }
        break;
      case "Right":
      case "ArrowRight":
        if (currentEventXY.changeCurrentEventX(1)) {
            pickUpColorFromSelectedPx();
        }
        break;
      default:
        return;
    }
    event.preventDefault();

  });

  changeColorController.getSliders().forEach($slider => {
    $slider.addEventListener('focus',
      () => shouldPreventCircleFromMovingByArrow = true
    );
    $slider.addEventListener('blur',
      () => shouldPreventCircleFromMovingByArrow = false
    );
  })

  document.addEventListener('keyup', event => {
    if (event.key === 'Control') {
      isControlKeyPressed = false;
    }
  });


};
