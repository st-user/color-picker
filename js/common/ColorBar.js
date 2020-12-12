import HsvRgbConverter from '../common/HsvRgbConverter.js';

const POINTER_AREA_HEIGHT = 8;
const GRADIENT_AREA_WIDTH = 296;
const GRADIENT_AREA_HEIGHT = 24;
const GRADIENT_AREA_PADDING = 10;
const POINTER_WIDTH = 6;
const CANVAS_HEIGHT = POINTER_AREA_HEIGHT + GRADIENT_AREA_HEIGHT;
const POINTER_COLOR = '#B8B8B8';

class ColorBar {

    #$canvas;
    #barXSize;

    // TODO 適宜コンストラクタ引数で渡せるようにしていく
    #gradientAreaWidth;
    #canvasWidth;

    constructor(canvasSelector, barXSize, styleConfig) {

        const $canvas = document.querySelector(canvasSelector);

        styleConfig = styleConfig || {};
        this.#gradientAreaWidth = styleConfig.gradientAreaWidth || GRADIENT_AREA_WIDTH;
        this.#canvasWidth = this.#gradientAreaWidth + GRADIENT_AREA_PADDING * 2;
        $canvas.width = this.#canvasWidth;
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
        ctx.clearRect(0, 0, this.#canvasWidth, POINTER_AREA_HEIGHT);

        const position = barX * this.#gradientAreaWidth / this.#barXSize  + GRADIENT_AREA_PADDING;

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
        const gradient = ctx.createLinearGradient(GRADIENT_AREA_PADDING, 0, this.#gradientAreaWidth, 0);
        const _barXIndex = this.#barXSize - 1;
        for (let x = 0; x <= _barXIndex; x++) {
            const stopRatio = x / _barXIndex;
            gradient.addColorStop(stopRatio, this.createColorStopValue(x, y, z));
        }
        ctx.clearRect(
            GRADIENT_AREA_PADDING, POINTER_AREA_HEIGHT, this.#gradientAreaWidth, GRADIENT_AREA_HEIGHT
        );
        ctx.fillStyle = gradient;
        ctx.fillRect(
            GRADIENT_AREA_PADDING, POINTER_AREA_HEIGHT, this.#gradientAreaWidth, GRADIENT_AREA_HEIGHT
        );
    }

    createColorStopValue(x, y, z) { // eslint-disable-line no-unused-vars
    }

}

class RgbColorBar extends ColorBar {

    constructor(canvasSelector, styleConfig) {
        super(canvasSelector, 256, styleConfig);
    }

    createColorStopValue(r, g, b) {
        return `rgba(${r}, ${g}, ${b}, 1)`;
    }
}



class HsvColorBar extends ColorBar {

    constructor(canvasSelector, styleConfig) {
        super(canvasSelector, 361, styleConfig);
    }

    createColorStopValue(h, s, v) {
        const hsl = HsvRgbConverter.hsvToHsl(h, s / 100, v / 100);
        return `hsla(${hsl.h}, ${hsl.s}%, ${hsl.l}%, 1)`;
    }
}

export { RgbColorBar, HsvColorBar };
