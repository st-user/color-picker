
const POINTER_AREA_HEIGHT = 16;
const GRADIENT_AREA_WIDTH = 400;
const GRADIENT_AREA_HEIGHT = 80;
const GRADIENT_AREA_PADDING = 10;
const POINTER_WIDTH = 6;
const CANVAS_WIDTH = GRADIENT_AREA_WIDTH + GRADIENT_AREA_PADDING * 2;
const CANVAS_HEIGHT = POINTER_AREA_HEIGHT + GRADIENT_AREA_HEIGHT;
const POINTER_COLOR = '#B8B8B8';

class ColorBar {

  #$canvas;
  #barXSize;

  constructor(canvasSelector, barXSize) {

    const $canvas = document.querySelector(canvasSelector);
    $canvas.width = CANVAS_WIDTH
    $canvas.height = CANVAS_HEIGHT;

    this.#$canvas = $canvas;
    this.#barXSize = barXSize;
  }

  changeBaseState(barX, g, b) {
    this.changePointerPosition(barX);
    this.changeGradient(g, b);
  }

  changePointerPosition(barX) {

    const ctx = this.#$canvas.getContext('2d');
    ctx.clearRect(0, 0, CANVAS_WIDTH, POINTER_AREA_HEIGHT);

    const position = barX * GRADIENT_AREA_WIDTH / this.#barXSize  + GRADIENT_AREA_PADDING;

    ctx.strokeStyle = POINTER_COLOR;
    ctx.fillStyle = POINTER_COLOR;
    ctx.beginPath();
    ctx.moveTo(position, POINTER_AREA_HEIGHT - 1);
    ctx.lineTo(position - POINTER_WIDTH / 2, 0);
    ctx.lineTo(position + POINTER_WIDTH, 0);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
  }

  changeGradient(y, z) {

    const ctx = this.#$canvas.getContext('2d');
    const gradient = ctx.createLinearGradient(GRADIENT_AREA_PADDING, 0, GRADIENT_AREA_WIDTH, 0);
    const _barXIndex = this.#barXSize - 1;
    for (let x = 0; x <= _barXIndex; x++) {
      const stopRatio = x / _barXIndex;
      gradient.addColorStop(stopRatio, this.createColorStopValue(x, y, z));
    }
    ctx.clearRect(
      GRADIENT_AREA_PADDING, POINTER_AREA_HEIGHT, GRADIENT_AREA_WIDTH, GRADIENT_AREA_HEIGHT
    );
    ctx.fillStyle = gradient;
    ctx.fillRect(
      GRADIENT_AREA_PADDING, POINTER_AREA_HEIGHT, GRADIENT_AREA_WIDTH, GRADIENT_AREA_HEIGHT
    );
  }

  createColorStopValue(x, y, z) {
  }

}

class RgbColorBar extends ColorBar {

  constructor(canvasSelector) {
    super(canvasSelector, 256);
  }

  createColorStopValue(r, g, b) {
    return `rgba(${r}, ${g}, ${b}, 1)`;
  }
}

const hsv_to_hsl = (h, _s, _v) => {

    let s = _s / 100;
    const v = _v / 100;
    const l = (2 - s) * v / 2;

    if (l != 0) {
        if (l == 1) {
            s = 0
        } else if (l < 0.5) {
            s = s * v / (l * 2)
        } else {
            s = s * v / (2 - l * 2)
        }
    }
    return [h, Math.round(s * 100), Math.round(l * 100)]
};

class HsvColorBar extends ColorBar {

  constructor(canvasSelector) {
    super(canvasSelector, 361);
  }

  createColorStopValue(h, s, v) {
    const hsl = hsv_to_hsl(h, s, v);
    return `hsla(${hsl[0]}, ${hsl[1]}%, ${hsl[2]}%, 1)`;
  }
}

export { RgbColorBar, HsvColorBar };
