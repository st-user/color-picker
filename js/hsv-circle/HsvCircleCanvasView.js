import { DOM } from 'vncho-lib';

import { hideColorPointerPinView } from '../common/CustomEventDispatcher.js';
import CanvasHandler from '../tool/CanvasHandler.js';
import HsvRgbConverter from '../common/HsvRgbConverter.js';

const STROKE_WIDTH = 20;
const CIRCLE_SIZE_CONFIGS = [
    {
        width: 180,
        height: 180,
        center: [ 90, 90 ],
        radius: 75
    },
    {
        width: 250,
        height: 250,
        center: [ 125, 125 ],
        radius: 100
    },
    {
        width: 400,
        height: 400,
        center: [ 200, 200 ],
        radius: 180
    },
];
const DEFAULT_CIRCLE_SIZE_CONFIG = CIRCLE_SIZE_CONFIGS[1];
const DEFAULT_VALUE = 100;

const rotate = (x, y, theta) => {
    return [
        Math.cos(theta) * x - Math.sin(theta) * y,
        Math.sin(theta) * x + Math.cos(theta) * y
    ];
};

export default class HsvCircleCanvasView extends CanvasHandler {

    #$valueSliderPos;
    #$valueSlider;
    #$hsvCircleDataControlArea;
    #$tab;

    #currentSizeConfig;
    #currentArcStep;
    #currentValue;

    constructor(colorModel) {
        super(colorModel, {
            canvasSelector: '#hsvCircleData',
            defaultWidth: DEFAULT_CIRCLE_SIZE_CONFIG.width,
            defaultHeight: DEFAULT_CIRCLE_SIZE_CONFIG.height
        });

        this.#currentSizeConfig = DEFAULT_CIRCLE_SIZE_CONFIG;
        this.#currentArcStep = Math.PI / 180;
        this.#currentValue = DEFAULT_VALUE;
        this.#$valueSliderPos = document.querySelector('#hsvCircleDataValueSliderPositioning');
        this.#$valueSlider = document.querySelector('#hsvCircleDataValueSlider');
        this.#$hsvCircleDataControlArea = document.querySelector('#hsvCircleDataControlArea');
        this.#$tab = document.querySelector('#hsvCircleAreaTabTitle');
    }

    setUpEvent() {
        super.setUpEvent();

        const $valueSlider = document.querySelector('#hsvCircleDataValueSlider');
        $valueSlider.addEventListener('change', () => {
            const value = $valueSlider.value;
            this.#currentValue = parseInt(value);
            this.#drawHsvCircleFromConfigs();
            hideColorPointerPinView();
        });
        $valueSlider.value = DEFAULT_VALUE;

        const $hsvCircleSizeSwitches = document.querySelectorAll('input[name="hsvCircleSizeSwitch"]');
        $hsvCircleSizeSwitches.forEach($switch => {
            $switch.addEventListener('change', () => {
                const selectedSize = $switch.value;
                this.#currentSizeConfig = CIRCLE_SIZE_CONFIGS[parseInt(selectedSize)];
                this.#drawHsvCircleFromConfigs();
                hideColorPointerPinView();
            });
        });
        document.querySelector('#hsvCircleSizeSwitchMedium').checked = true;

        const $hsvCircleDivisionCountSwitches = document.querySelectorAll('input[name="hsvCircleDivisionCountSwitch"]');
        $hsvCircleDivisionCountSwitches.forEach($switch => {
            $switch.addEventListener('change', () => {
                const selectedCount = $switch.value;
                this.#currentArcStep = Math.PI / (parseInt(selectedCount) / 2);
                this.#drawHsvCircleFromConfigs();
                hideColorPointerPinView();
            });
        });
        document.querySelector('#hsvCircleDivisionCountSwitchNone').checked = true;

        this.#drawHsvCircleFromConfigs();
    }

    getControllersUsingWithArrowKey() {
        return [ this.#$valueSlider ];
    }

    containsX(x) {
        return this.containsXY(x, this.currentEventXY().y());
    }

    containsY(y) {
        return this.containsXY(this.currentEventXY().x(), y);
    }

    containsXY(x, y) {
        const canvasPosition = DOM.getElementPosition(this.canvas());
        const canvasX = x - canvasPosition.left;
        const canvasY = y - canvasPosition.top;
        const center = this.#currentSizeConfig.center;
        const radiusWithStrokeWidth = this.#currentSizeConfig.radius + STROKE_WIDTH / 2;
        const squaredDistanceFromCenter = Math.pow(canvasX - center[0], 2)
                                       + Math.pow(canvasY - center[1], 2);

        return squaredDistanceFromCenter < (radiusWithStrokeWidth * radiusWithStrokeWidth);
    }

    displayed() {
        return this.#$tab.checked;
    }

    #drawHsvCircleFromConfigs() {
        const sliderLength = this.#currentSizeConfig.height;
        this.#$valueSliderPos.style.height = (sliderLength) + 'px';
        this.#$valueSlider.style.width = (sliderLength * 0.8) + 'px';
        this.#$valueSlider.style.left = (-sliderLength * 0.8 / 2 + 16) + 'px';
        this.#$hsvCircleDataControlArea.style.width = (this.#currentSizeConfig.width) + 'px';
        this.#drawHsvCircle(
            this.#currentSizeConfig.width,
            this.#currentSizeConfig.height,
            this.#currentSizeConfig.center,
            this.#currentSizeConfig.radius,
            this.#currentArcStep,
            this.#currentValue
        );
    }

    #drawHsvCircle(canvasWidth, canvasHeight, center, radius, radGranularity, value) {
        const $canvas = this.canvas();
        $canvas.width = canvasWidth;
        $canvas.height = canvasHeight;

        const ctx = $canvas.getContext('2d');
        ctx.clearRect(0, 0, canvasWidth, canvasHeight);

        for (let saturation = radius; 0 <= saturation; saturation--) {
            this.#drawCircle(
                saturation, center, radius, radGranularity, value
            );
        }
    }

    #drawCircle(saturation, center, radius, radGranularity, value) {

        const startXY = rotate(0, -saturation, -18 / 180 * Math.PI);
        let currentX = startXY[0];
        let currentY = startXY[1];
        let totalTheta = 0;
        const ctx = this.canvas().getContext('2d');
        ctx.lineWidth = STROKE_WIDTH;

        const draw = () => {

            ctx.beginPath();
            ctx.moveTo(currentX + center[0], currentY + center[1]);
            const nextXY = rotate(currentX, currentY, radGranularity);
            currentX = nextXY[0];
            currentY = nextXY[1];
            const currentTheta = totalTheta;
            const hsl = HsvRgbConverter.hsvToHsl(
                Math.round(currentTheta * 180 / Math.PI),
                saturation / radius,
                value / 100);
            ctx.strokeStyle = `hsla(${hsl.h}, ${hsl.s}%, ${hsl.l}%, 1)`;
            ctx.lineTo(currentX + center[0], currentY + center[1]);
            ctx.stroke();

            totalTheta += radGranularity;
            if (totalTheta < Math.PI * 2) {
                draw();
            }
        };

        draw();
    }

}
