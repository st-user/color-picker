import CustomEventNames from '../common/CustomEventNames.js';
import CurrentEventXY from './CurrentEventXY.js';
import ElementUtil from '../common/ElementUtil.js';

export default class CanvasHandler {

    #colorModel;

    #$canvas;

    #currentEventXY;
    #shouldHandleMousemoveEvent;

    constructor(colorModel, config) {

        this.#colorModel = colorModel;

        const $canvas = document.querySelector(config.canvasSelector);

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

    currentEventXY() {
        return this.#currentEventXY;
    }

    containsX(x) { return true; } // eslint-disable-line no-unused-vars
    containsY(y) { return true; } // eslint-disable-line no-unused-vars
    containsXY(x, y) { return true; } // eslint-disable-line no-unused-vars
    displayed() { return false; }

    #dispatchEvent() {
        if (this.#currentEventXY.exists()) {

            const x = this.#currentEventXY.x();
            const y = this.#currentEventXY.y();
            const rgbaData = this.#extractRgb(x, y);

            const newEvent = new CustomEvent(
                CustomEventNames.COLOR_PICKER__IMAGE_DATA_POINTED, {
                    detail: {
                        eventX: this.#currentEventXY.x(),
                        eventY: this.#currentEventXY.y()
                    }
                });

            document.dispatchEvent(newEvent);
            this.#colorModel.setRgbFromValidInteger(rgbaData[0], rgbaData[1], rgbaData[2]);
        }
    }

    #dispatchPointEvent(event) {

        if (!this.displayed()) {
            return;
        }

        if (!this.containsXY(event.pageX, event.pageY)) {
            return;
        }

        this.#currentEventXY.set({
            x: event.pageX,
            y: event.pageY
        });
        this.#dispatchEvent();
    }

    #dispatchMoveEvent(event) {

        if (!this.displayed()) {
            return;
        }

        if (this.#shouldHandleMousemoveEvent) {
            if (!this.containsXY(event.pageX, event.pageY)) {
                return;
            }
            this.#dispatchPointEvent(event);
        }
    }

    #dispatchArrowKeyPressedEvent(event) {

        if (!this.displayed()) {
            return;
        }

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

        const canvasPosition = ElementUtil.getElementPosition($canvas);
        const canvasX = currentEventX - canvasPosition.left;
        const canvasY = currentEventY - canvasPosition.top;

        const ctx = $canvas.getContext('2d');
        const imageData = ctx.getImageData(canvasX, canvasY, 1, 1);
        return imageData.data;
    }


}
