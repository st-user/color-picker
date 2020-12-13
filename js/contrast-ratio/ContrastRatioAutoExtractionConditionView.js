/*globals require */
const noUiSlider = require('../../node_modules/nouislider/distribute/nouislider.js');
import { HsvColorBar } from '../common/ColorBar.js';
import RgbUtil from '../common/RgbUtil.js';

const TASK_UNIT_COUNT = 1000;


const decimalStringToInteger = d => {
    return Math.round(parseFloat(d));
};

const currentRangeTemplate = data => {
    return `>${data[0]}以上 ${data[1]}以下`;
};


export default class ContrastRatioAutoExtractionConditionView {

    #$contrastRatioExtractionConditionTitle;
    #$contrastRatioExtractionCondition;
    #isConditionOpend;


    #$contrastRatioRangeHsvSilder_h;
    #$contrastRatioRangeSliderCurrent_h;
    #slider_h;
    #hsvColorBar;

    #$contrastRatioRangeHsvSilder_s;
    #$contrastRatioRangeSliderCurrent_s;
    #slider_s;

    #$contrastRatioRangeHsvSilder_v;
    #$contrastRatioRangeSliderCurrent_v;
    #slider_v;


    #$contrastRatioExtractionRange;
    #$contrastRatioRangeSliderCurrent_ratioRange;
    #extractionRangeSlider;

    #$contrastRatioExtractionCount;

    #$contrastRatioExtractionThreadCount;

    constructor() {

        this.#$contrastRatioExtractionConditionTitle = document.querySelector('#contrastRatioExtractionConditionTitle');
        this.#$contrastRatioExtractionCondition = document.querySelector('#contrastRatioExtractionCondition');

        this.#$contrastRatioRangeHsvSilder_h = document.querySelector('#contrastRatioRangeHsvSilder_h');
        this.#$contrastRatioRangeSliderCurrent_h = document.querySelector('#contrastRatioRangeSliderCurrent_h');
        this.#$contrastRatioRangeHsvSilder_s = document.querySelector('#contrastRatioRangeHsvSilder_s');
        this.#$contrastRatioRangeSliderCurrent_s = document.querySelector('#contrastRatioRangeSliderCurrent_s');
        this.#$contrastRatioRangeHsvSilder_v = document.querySelector('#contrastRatioRangeHsvSilder_v');
        this.#$contrastRatioRangeSliderCurrent_v = document.querySelector('#contrastRatioRangeSliderCurrent_v');

        this.#$contrastRatioExtractionRange = document.querySelector('#contrastRatioExtractionRange');
        this.#$contrastRatioRangeSliderCurrent_ratioRange = document.querySelector('#contrastRatioRangeSliderCurrent_ratioRange');

        this.#$contrastRatioExtractionCount = document.querySelector('#contrastRatioExtractionCount');

        this.#$contrastRatioExtractionThreadCount = document.querySelector('#contrastRatioExtractionThreadCount');

        this.#slider_h = noUiSlider.create(this.#$contrastRatioRangeHsvSilder_h, {
            start: [0, 360],
            connect: true,
            range: {
                'min': 0,
                'max': 360
            }
        });

        this.#slider_s = noUiSlider.create(this.#$contrastRatioRangeHsvSilder_s, {
            start: [0, 100],
            connect: true,
            range: {
                'min': 0,
                'max': 100
            }
        });

        this.#slider_v = noUiSlider.create(this.#$contrastRatioRangeHsvSilder_v, {
            start: [0, 100],
            connect: true,
            range: {
                'min': 0,
                'max': 100
            }
        });

        this.#extractionRangeSlider = noUiSlider.create(this.#$contrastRatioExtractionRange, {
            start: [1, 21],
            connect: true,
            range: {
                'min': 1,
                'max': 21
            }
        });

        this.#hsvColorBar = new HsvColorBar('#contrastRatioRangeHsvColorBar', {
            gradientAreaWidth: 180
        });
        this.#hsvColorBar.changeGradient(100, 100);

        this.#isConditionOpend = true;
        this.#toggleCondition();
    }

    setUpEvent() {

        this.#$contrastRatioExtractionConditionTitle.addEventListener('click', () => {
            this.#toggleCondition();
        });

        const setCurrentRange = (slider, $target) => {
            const text = currentRangeTemplate(this.#extractRangeFromNoSlider(slider));
            $target.textContent = text;
        };

        const setCurrentRangeOnChange = (slider, $target) => {
            slider.on('change', () => setCurrentRange(slider, $target));
        };

        setCurrentRange(this.#slider_h, this.#$contrastRatioRangeSliderCurrent_h);
        setCurrentRangeOnChange(this.#slider_h, this.#$contrastRatioRangeSliderCurrent_h);
        setCurrentRange(this.#slider_s, this.#$contrastRatioRangeSliderCurrent_s);
        setCurrentRangeOnChange(this.#slider_s, this.#$contrastRatioRangeSliderCurrent_s);
        setCurrentRange(this.#slider_v, this.#$contrastRatioRangeSliderCurrent_v);
        setCurrentRangeOnChange(this.#slider_v, this.#$contrastRatioRangeSliderCurrent_v);
        setCurrentRange(this.#extractionRangeSlider, this.#$contrastRatioRangeSliderCurrent_ratioRange);
        setCurrentRangeOnChange(this.#extractionRangeSlider, this.#$contrastRatioRangeSliderCurrent_ratioRange);

    }

    #toggleCondition() {
        this.#isConditionOpend = !this.#isConditionOpend;
        const $triangle = this.#$contrastRatioExtractionConditionTitle.querySelector('.tool-contrast-ratio-area__auto-extraction-title-toggle-mark');
        if (this.#isConditionOpend) {
            $triangle.classList.remove('is-closed');
            $triangle.classList.add('is-opened');
            this.#$contrastRatioExtractionCondition.style.display = 'block';
        } else {
            $triangle.classList.remove('is-opened');
            $triangle.classList.add('is-closed');
            this.#$contrastRatioExtractionCondition.style.display = 'none';
        }
    }

    createConditions() {
        const cond = this.#createCondition();
        return RgbUtil.divideSRGBSpace(TASK_UNIT_COUNT)
            .map(r => {
                return Object.assign({
                    targetRange: r
                }, cond);
            });
    }

    getThreadCount() {
        return this.#extractNumberFromSelect(this.#$contrastRatioExtractionThreadCount);
    }

    getContrastRatioExtractionCount() {
        return this.#extractNumberFromSelect(this.#$contrastRatioExtractionCount);
    }

    #createCondition() {
        return {
            hueRange: this.#extractRangeFromNoSlider(this.#slider_h),
            saturationRange: this.#extractRangeFromNoSlider(this.#slider_s),
            valueRange: this.#extractRangeFromNoSlider(this.#slider_v),
            contrastRatioRange: this.#extractRangeFromNoSlider(this.#extractionRangeSlider)
        };
    }

    #extractNumberFromSelect($select) {
        const idx = $select.selectedIndex;
        return parseInt($select.querySelectorAll('option')[idx].value);
    }

    #extractRangeFromNoSlider(slider) {
        return slider.get().map(d => decimalStringToInteger(d));
    }
}
