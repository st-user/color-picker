export default class ColorPointerCircles {

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
