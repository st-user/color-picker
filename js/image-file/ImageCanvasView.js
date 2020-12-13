import CanvasHandler from '../tool/CanvasHandler.js';
import CommonEventDispatcher from '../common/CommonEventDispatcher.js';
import CustomEventNames from '../common/CustomEventNames.js';

export default class ImageCanvasView extends CanvasHandler {

    #$noImageData;
    #$tab;

    constructor(colorModel) {
        super(colorModel, {
            canvasSelector: '#imageData',
            defaultWidth: 160,
            defaultHeight: 90
        });
        const $noImageData = document.querySelector('#noImageData');
        this.#changeStyleDisplay($noImageData, this.canvas());

        this.#$noImageData = $noImageData;
        this.#$tab = document.querySelector('#imageFileAreaTabTitle');
    }

    setUpEvent() {
        super.setUpEvent();
        CommonEventDispatcher.on(CustomEventNames.COLOR_PICKER__IMAGE_FILE_LOADED, event => {
            const detail = event.detail;
            this.#drawImageWithSpecificSize(detail.image, detail.width, detail.height);
        });
    }

    containsX(x) {
        const $canvas = this.canvas();

        const min = $canvas.offsetLeft;
        const max = min + $canvas.width;
        return min <= x && x <= max;
    }

    containsY(y) {
        const $canvas = this.canvas();

        const min = $canvas.offsetTop;
        const max = min + $canvas.height;
        return min <= y && y <= max;
    }

    displayed() {
        return this.#$tab.checked;
    }

    #drawImageWithSpecificSize(image, width, height) {
        if (!image) {
            return;
        }
        const $canvas = this.canvas();
        this.#changeStyleDisplay($canvas, this.#$noImageData);

        $canvas.width = width;
        $canvas.height = height;

        const ctx = $canvas.getContext('2d');
        ctx.clearRect(0, 0, width, height);
        ctx.drawImage(image, 0, 0, width, height);
    }

    #changeStyleDisplay($toBlock, $toNone) {
        $toBlock.style.display = 'block';
        $toNone.style.display = 'none';
    }
}
