import CustomEventNames from './CustomEventNames.js';
import CurrentEventXY from './CurrentEventXY.js';

export default class CanvasHandler {

  #$canvas;

  #currentEventXY;
  #shouldHandleMousemoveEvent;

  constructor(config) {
    const $canvas = document.querySelector('#imageData');

    $canvas.width = config.defaultWidth;
    $canvas.height = config.defaultHeight;

    this.#$canvas = $canvas;
    this.#currentEventXY = new CurrentEventXY();
  }

  setUpEvent() {

    this.#$canvas.addEventListener('mousedown', event => this.#dispatchPointEvent(event));
    this.#$canvas.addEventListener('click', event => this.#dispatchPointEvent(event));
    this.#$canvas.addEventListener('mousemove', event => this.#dispatchMoveEvent(event));

    document.addEventListener(
      CustomEventNames.COLOR_PICKER__ARROW_KEY_PRESSED,
      event => this.#dispatchArrowKeyPressedEvent(event));

    document.addEventListener(
      CustomEventNames.COLOR_PICKER__CONTROL_KEY_PRESSED,
      event => this.#controlKeyPressed(event));
  }

  canvas() {
    return this.#$canvas;
  }

  containsX(x) { return true; }
  containsY(y) { return true; }

  #dispatchEvent() {
    if (this.#currentEventXY.exists()) {

      const x = this.#currentEventXY.x();
      const y = this.#currentEventXY.y();
      const rgbaData = this.#extractRgb(x, y);

      const newEvent = new CustomEvent(
        CustomEventNames.COLOR_PICKER__IMAGE_DATA_POINTED, {
        detail: {
          eventX: this.#currentEventXY.x(),
          eventY: this.#currentEventXY.y(),
          rgbaData: rgbaData
        }
      });

      document.dispatchEvent(newEvent);
    }
  }

  #dispatchPointEvent(event) {
    this.#currentEventXY.set({
      x: event.pageX,
      y: event.pageY
    });
    this.#dispatchEvent();
  }

  #dispatchMoveEvent(event) {
    if (this.#shouldHandleMousemoveEvent) {
      this.#dispatchPointEvent(event);
    }
  }

  #dispatchArrowKeyPressedEvent(event) {

    const detail = event.detail;
    const xDiff = detail.x;
    const yDiff = detail.y;

    if (xDiff) {
      if (this.#currentEventXY.changeCurrentEventX(
                                xDiff,
                                x => this.containsX(x))) {
        this.#dispatchEvent();
      }
    }

    if (yDiff) {
      if (this.#currentEventXY.changeCurrentEventY(
                                yDiff,
                                y => this.containsY(y))) {
        this.#dispatchEvent();
      }
    }
  }

  #controlKeyPressed(event) {
    const detail = event.detail;
    this.#shouldHandleMousemoveEvent = detail.state;
  }

  #extractRgb(currentEventX, currentEventY) {
    const $canvas = this.#$canvas;

    const canvasX = currentEventX - $canvas.offsetLeft;
    const canvasY = currentEventY - $canvas.offsetTop;

    const ctx = $canvas.getContext('2d');
    const imageData = ctx.getImageData(canvasX, canvasY, 1, 1);
    return imageData.data;
  }


}
