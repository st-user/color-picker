
import ContrastRatioCalculator from './ContrastRatioCalculator.js';
import HsvRgbConverter from './HsvRgbConverter.js';
import ContrastRatioExplanations from './ContrastRatioExplanations.js';

const pickedColorTemplate = data => {
    return `
    <div class="tool-contrast-ratio-area__picked-color-bar" style="background-color: ${data.colorCode};" data-color-info-id="${data.id}" draggable="true">
      <span class="tool-contrast-ratio-area__picked-color-bar-text">${data.colorCode}</span>
    </div>
  `;
};



export default class ContrastRatioCheck {

    #explanations;

    #$contrastRatioPickedColor1;
    #$contrastRatioPickedColor2;
    #$contrastRatioForPickedColorRatio;

    #$contrastRatioCheckCriteriaNormal;
    #$contrastRatioCheckCriteriaLarge;

    #colorInfo1;
    #colorInfo2;
    #isSwapping;

    #droppedBarCounter;

    constructor() {

        this.#explanations = new ContrastRatioExplanations(
            '#contrastRatioCheckTitle .tool-contrast-ratio-area__explanations-to-close',
            '#contrastRatioCheckTitle .tool-contrast-ratio-area__explanations-to-open',
            '#contrastRatioCheckArea .tool-contrast-ratio-area__function-explanations'
        );

        this.#$contrastRatioPickedColor1 = document.querySelector('#contrastRatioPickedColor1');
        this.#$contrastRatioPickedColor2 = document.querySelector('#contrastRatioPickedColor2');
        this.#$contrastRatioForPickedColorRatio = document.querySelector('#contrastRatioForPickedColorRatio');

        this.#$contrastRatioCheckCriteriaNormal = document.querySelector('#contrastRatioCheckCriteriaNormal');
        this.#$contrastRatioCheckCriteriaLarge = document.querySelector('#contrastRatioCheckCriteriaLarge');

        this.#colorInfo1 = {};
        this.#colorInfo2 = {};
        this.#isSwapping = false;

        this.#droppedBarCounter = 0;
    }

    setUpEvent() {

        const preventDefaultOnDragover = $element => {
            $element.addEventListener('dragover', event => {
                event.preventDefault();
            });
        };

        const setPickedColor = ($element, colorInfoSetter) => {
            $element.addEventListener('drop', event => {
                event.preventDefault();

                const dataTransferred = event.dataTransfer.getData('text/plain');
                if (!dataTransferred) {
                    return;
                }

                if (this.#isSwapping) {
                    this.#swapColors();
                    return;
                }

                if (dataTransferred.indexOf('#') === 0) {

                    const $existingBar = $element.querySelector('.tool-contrast-ratio-area__picked-color-bar');
                    if ($existingBar) {
                        $existingBar.remove();
                    }
                    const colorCode = dataTransferred;
                    const id = this.#generateBarId();

                    const colorBar = pickedColorTemplate({
                        id: id, colorCode: colorCode
                    });
                    const r = HsvRgbConverter.colorCodeToR(colorCode);
                    const g = HsvRgbConverter.colorCodeToG(colorCode);
                    const b = HsvRgbConverter.colorCodeToB(colorCode);
                    const luminance = ContrastRatioCalculator.calcLuminance(r, g, b);

                    colorInfoSetter({
                        colorCode: colorCode,
                        luminance: luminance
                    });

                    $element.insertAdjacentHTML('beforeend', colorBar);

                    this.#setUpBarEvent($element, colorCode);
                    this.#reflectContrastRatioInfo();
                }

            });
        };

        preventDefaultOnDragover(this.#$contrastRatioPickedColor1);
        preventDefaultOnDragover(this.#$contrastRatioPickedColor2);

        setPickedColor(this.#$contrastRatioPickedColor1, l => this.#colorInfo1 = l);
        setPickedColor(this.#$contrastRatioPickedColor2, l => this.#colorInfo2 = l);

        this.#explanations.setUpEvent();
    }

    #swapColors() {
        const colorInfo1 = this.#colorInfo1;
        const colorInfo2 = this.#colorInfo2;

        this.#colorInfo2 = colorInfo1;
        this.#colorInfo1 = colorInfo2;

        this.#renewColorBar(this.#$contrastRatioPickedColor1, this.#colorInfo1.colorCode);
        this.#renewColorBar(this.#$contrastRatioPickedColor2, this.#colorInfo2.colorCode);

        this.#reflectContrastRatioInfo();
    }

    #renewColorBar($element, colorCode) {

        const $existingBar = $element.querySelector('.tool-contrast-ratio-area__picked-color-bar');

        if ($existingBar) {
            $existingBar.remove();
        }

        if (!colorCode) {
            const $message = $element.querySelector('.tool-contrast-ratio-area__picked-color-message');
            $message.style.display = 'block';
            return;
        }

        const id = this.#generateBarId();
        const colorBar = pickedColorTemplate({
            id: id, colorCode: colorCode
        });

        $element.insertAdjacentHTML('beforeend', colorBar);
        this.#setUpBarEvent($element, colorCode);
    }

    #setUpBarEvent($element, colorCode) {

        const $newBar = $element.querySelector('.tool-contrast-ratio-area__picked-color-bar');

        $newBar.addEventListener('dragstart', event => {
            this.#isSwapping = true;
            $newBar.classList.add('is-dragging');
            event.dataTransfer.effectAllowed = 'move';
            event.dataTransfer.setData('text/plain', colorCode);
        });

        $newBar.addEventListener('dragenter', () => {
            $newBar.classList.add('is-over');
        });

        $newBar.addEventListener('dragleave', () => {
            $newBar.classList.remove('is-over');
        });

        $newBar.addEventListener('dragend', () => {
            this.#isSwapping = false;
            $newBar.classList.remove('is-dragging');
        });

        const $message = $element.querySelector('.tool-contrast-ratio-area__picked-color-message');
        $message.style.display = 'none';
    }

    #reflectContrastRatioInfo() {
        if (!this.#colorInfo1.colorCode || !this.#colorInfo2.colorCode) {
            return;
        }
        this.#drawContrastRatio();
        this.#changeColor(
            this.#$contrastRatioCheckCriteriaNormal,
            this.#colorInfo1.colorCode,
            this.#colorInfo2.colorCode
        );
        this.#changeColor(
            this.#$contrastRatioCheckCriteriaLarge,
            this.#colorInfo1.colorCode,
            this.#colorInfo2.colorCode
        );
    }

    #changeColor($element, bgColor, textColor) {
        $element.querySelectorAll('.tool-contrast-ratio-area__check-criteria-sample').forEach($text => {
            $text.style.backgroundColor = bgColor;
            $text.style.color = textColor;
        });
    }

    #drawContrastRatio() {

        const luminanceColor1 = this.#colorInfo1.luminance;
        const luminanceColor2 = this.#colorInfo2.luminance;

        const ratio = ContrastRatioCalculator.calcContrastRatio(luminanceColor1, luminanceColor2);
        let r1 = ratio, r2 = 1;
        if (luminanceColor1 < luminanceColor2) {
            r1 = 1, r2 = ratio;
        }
        const round2 = val => Math.round(val * 100) / 100;
        this.#$contrastRatioForPickedColorRatio.textContent = `${round2(r1)} : ${round2(r2)}`;

        this.#checkSuccessCriteria(
            this.#$contrastRatioCheckCriteriaNormal,
            ratio,
            ContrastRatioCalculator.checkSuccessCriteriaNormalAA,
            ContrastRatioCalculator.checkSuccessCriteriaNormalAAA);

        this.#checkSuccessCriteria(
            this.#$contrastRatioCheckCriteriaLarge,
            ratio,
            ContrastRatioCalculator.checkSuccessCriteriaLargeAA,
            ContrastRatioCalculator.checkSuccessCriteriaLargeAAA);
    }

    #checkSuccessCriteria($element, ratio, checkerForAA, checkerForAAA) {

        this.#checkSuccessCriteriaEach(
            $element,
            '.tool-contrast-ratio-area__check-criteria-aa',
            ratio,
            checkerForAA
        );

        this.#checkSuccessCriteriaEach(
            $element,
            '.tool-contrast-ratio-area__check-criteria-aaa',
            ratio,
            checkerForAAA
        );
    }

    #checkSuccessCriteriaEach($element, elSelector, ratio, checker) {

        const isCriteriaSatisfied = checker(ratio);
        const result = isCriteriaSatisfied ? 'OK' : 'NG';
        const addClass = isCriteriaSatisfied ? 'is-ok' : 'is-ng';
        const removeClass = isCriteriaSatisfied ? 'is-ng' : 'is-ok';

        const $check = $element.querySelector(elSelector);
        $check.textContent = result;
        $check.classList.add(addClass);
        $check.classList.remove(removeClass);
    }

    #generateBarId() {
        const ret = this.#droppedBarCounter;
        this.#droppedBarCounter++;
        return ret;
    }

}
