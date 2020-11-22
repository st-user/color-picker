import Constants from "./Constants.js";

export default class CanvasHandler {

  #$canvas;

  constructor() {
    const $canvas = document.querySelector('#imageData');

    $canvas.width = 160;
    $canvas.height = 90;

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
