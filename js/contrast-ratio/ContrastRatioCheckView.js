import ContrastRatioCalculator from './ContrastRatioCalculator.js';
import ContrastRatioCheckModel from './ContrastRatioCheckModel.js';
import ContrastRatioExplanations from './ContrastRatioExplanations.js';
import CustomEventNames from '../common/CustomEventNames.js';

const pickedColorTemplate = data => {
    return `
    <div class="tool-contrast-ratio-area__picked-color-bar" style="background-color: ${data.colorCode};" data-color-info-id="${data.id}" draggable="true">
      <span class="tool-contrast-ratio-area__picked-color-bar-text">${data.colorCode}</span>
    </div>
  `;
};



export default class ContrastRatioCheckView {

    #contrastRatioCheckModel;

    #explanations;

    #$contrastRatioPickedColor1;
    #$contrastRatioPickedColor2;
    #$contrastRatioForPickedColorRatio;

    #$contrastRatioCheckCriteriaNormal;
    #$contrastRatioCheckCriteriaLarge;

    #isSwapping;

    #droppedBarCounter;

    constructor() {

        this.#contrastRatioCheckModel = new ContrastRatioCheckModel();

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
                    this.#contrastRatioCheckModel.swapColors();
                    return;
                }

                if (dataTransferred.indexOf('#') === 0) {
                    const colorCode = dataTransferred;
                    colorInfoSetter(colorCode);
                }

            });
        };

        preventDefaultOnDragover(this.#$contrastRatioPickedColor1);
        preventDefaultOnDragover(this.#$contrastRatioPickedColor2);

        setPickedColor(this.#$contrastRatioPickedColor1,
            color => this.#contrastRatioCheckModel.setBackgroundColorFromColorCode(color)
        );
        setPickedColor(this.#$contrastRatioPickedColor2,
            color => this.#contrastRatioCheckModel.setTextColorFromColorCode(color)
        );

        document.addEventListener(CustomEventNames.COLOR_PICKER__CHANGE_CONTRAST_RATIO_CHECK_COLOR, event => {
            const bgColor = event.detail.backgroundColor;
            const textColor = event.detail.textColor;
            this.#renderContrastRatioInfo(bgColor, textColor);
        });

        this.#explanations.setUpEvent();
    }

    #renderContrastRatioInfo(backgroundColor, textColor) {

        this.#renewColorBar(this.#$contrastRatioPickedColor1, backgroundColor);
        this.#renewColorBar(this.#$contrastRatioPickedColor2, textColor);

        this.#reflectContrastRatioInfo(backgroundColor, textColor);
    }

    #renewColorBar($element, color) {

        const $existingBar = $element.querySelector('.tool-contrast-ratio-area__picked-color-bar');

        if ($existingBar) {
            $existingBar.remove();
        }

        if (!color) {
            const $message = $element.querySelector('.tool-contrast-ratio-area__picked-color-message');
            $message.style.display = 'block';
            return;
        }
        const colorCode = color.getColorCode();

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

    #reflectContrastRatioInfo(backgroundColor, textColor) {
        if (!backgroundColor || !textColor) {
            return;
        }
        this.#drawContrastRatio(backgroundColor, textColor);
        this.#changeColor(
            this.#$contrastRatioCheckCriteriaNormal,
            backgroundColor.getColorCode(),
            textColor.getColorCode()
        );
        this.#changeColor(
            this.#$contrastRatioCheckCriteriaLarge,
            backgroundColor.getColorCode(),
            textColor.getColorCode()
        );
    }

    #changeColor($element, bgColor, textColor) {
        $element.querySelectorAll('.tool-contrast-ratio-area__check-criteria-sample').forEach($text => {
            $text.style.backgroundColor = bgColor;
            $text.style.color = textColor;
        });
    }

    #drawContrastRatio(backgroundColor, textColor) {

        const luminanceColor1 = backgroundColor.calcLuminance();
        const luminanceColor2 = textColor.calcLuminance();

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
