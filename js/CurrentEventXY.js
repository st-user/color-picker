export default class CurrentEventXY {

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
