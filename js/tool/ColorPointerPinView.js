import CustomEventNames from '../common/CustomEventNames.js';
import debounce from '../common/Debounce.js';

const CENTER = [20, 20];
const R = 16;
const PIN_LENGTH = 20;
const RAD = Math.PI / 6;

export default class ColorPointerPinView {

    #$pointerCanvas;
    #$pointedElements;

    constructor() {
        this.#$pointerCanvas = document.querySelector('#colorPointerPin');
        this.#$pointedElements = ['#hsvCircleData', '#imageData']
            .map(selector => document.querySelector(selector));

        const pointerCtx = this.#$pointerCanvas.getContext('2d');

        pointerCtx.fillStyle = 'white';
        pointerCtx.beginPath();
        pointerCtx.arc(
            CENTER[0],
            CENTER[1],
            R,
            Math.PI / 2 + RAD,
            Math.PI * 2 + Math.PI / 2 - RAD);
        pointerCtx.lineTo(CENTER[0], CENTER[1] + R * Math.cos(RAD) + PIN_LENGTH);
        pointerCtx.lineTo(CENTER[0] - R * Math.sin(RAD), CENTER[1] + R * Math.cos(RAD));
        pointerCtx.fill();
        pointerCtx.stroke();

        this.#hide();
    }

    setUpEvent() {
        this.#$pointerCanvas.addEventListener('click', event => {

            this.#$pointedElements.forEach($element => {

                const newEvent = new MouseEvent('click', {
                    clientX: event.pageX,
                    clientY: event.pageY
                });
                $element.dispatchEvent(newEvent);
            });
        });

        document.addEventListener(CustomEventNames.COLOR_PICKER__IMAGE_DATA_POINTED, event => {
            const detail = event.detail;
            this.#show(detail.eventX, detail.eventY);
        });

        document.addEventListener(CustomEventNames.COLOR_PICKER__IMAGE_FILE_LOADED, () => this.#hide());
        document.addEventListener(CustomEventNames.COLOR_PICKER__HIDE_COLOR_POINTER_PIN, () => this.#hide());

        window.addEventListener('resize', debounce(() => {
            this.#hide();
        }, 500));
    }

    #show(x, y) {
        const dX = x - (CENTER[0] + 1);
        const dY = y - (CENTER[1] + R * Math.cos(RAD) + PIN_LENGTH - 1);
        this.#$pointerCanvas.style.display = 'block';
        this.#$pointerCanvas.style.left = dX + 'px';
        this.#$pointerCanvas.style.top = dY + 'px';
    }

    #hide() {
        this.#$pointerCanvas.style.display = 'none';
    }
}
