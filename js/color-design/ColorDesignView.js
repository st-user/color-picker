import HsvRgbConverter from '../common/HsvRgbConverter.js';
import ScatterChart from './ScatterChart.js';
import CommonEventDispatcher from '../common/CommonEventDispatcher.js';

const whitespaceRegExp = /^\s+$/;
const charRegExp = /[<>&"'\\]/;

const colorTemplate = data => {
    return `
    <div class="tool-color-design-area__picked-color-bar" data-color-info-id="${data.id}" draggable="true">
      <span class="tool-color-design-area__picked-color-bar-text">${data.colorCode}</span>
      <span class="tool-color-design-area__picked-color-bar-del">×</span>
    </div>
  `;
};


export default class ColorDesignView {

    #$colorDesignListOfColors;
    #$colorDesignListOfColorsText;
    #$tabInput;

    #droppedBarCounter;
    #droppedColorInfoMap;
    #$movingBar;

    #scatterChart;

    #$colorDesignPatternName;
    #$addColorDesignPattern;
    #$colorDesignPatternNameError;

    #completeSettingColorInfo;

    constructor() {

        this.#$colorDesignListOfColors = document.querySelector('#colorDesignListOfColors');
        this.#$colorDesignListOfColorsText = document.querySelector('#colorDesignListOfColorsText');
        this.#$tabInput = document.querySelector('#colorDesignAreaTabTitle');

        this.#droppedBarCounter = 0;
        this.#droppedColorInfoMap = {};

        this.#scatterChart = new ScatterChart();

        this.#$colorDesignPatternName = document.querySelector('#colorDesignPatternName');
        this.#$addColorDesignPattern = document.querySelector('#addColorDesignPattern');
        this.#$colorDesignPatternNameError = document.querySelector('#colorDesignPatternNameError');

        this.#completeSettingColorInfo = true;
    }

    setUpEvents(onAddColorDesignPattern) {

        this.#$colorDesignListOfColors.addEventListener('dragover', e => {
            e.preventDefault();
        });

        this.#$colorDesignListOfColors.addEventListener('drop', e => {

            const dataTransferred = e.dataTransfer.getData('text/plain');
            if (!dataTransferred) {
                return;
            }

            if (dataTransferred.indexOf('#') === 0) {

                const colorCode = dataTransferred;
                const r = HsvRgbConverter.colorCodeToR(colorCode);
                const g = HsvRgbConverter.colorCodeToG(colorCode);
                const b = HsvRgbConverter.colorCodeToB(colorCode);
                const hsv = HsvRgbConverter.rgbToHsv(r, g, b);
                const hsl = HsvRgbConverter.hsvToHsl(hsv.h, hsv.s / 100, hsv.v / 100);

                const colorInfoWithoutId = {
                    colorCode: colorCode,
                    rgb: { r: r, g: b, b: b },
                    hsv: hsv,
                    hsl: hsl
                };
                this.#setColorInfo(colorInfoWithoutId);

            } else {

                const patternInfo = JSON.parse(dataTransferred);
                this.setColorInfoFromPatternInfoIfConfirmed(patternInfo);
            }

            e.preventDefault();

        });

        this.#$colorDesignPatternName.addEventListener('keyup', () => {

            const inputName = this.#$colorDesignPatternName.value;
            let error;
            if (!inputName) {
                error = '配色名を入力してください';
            }

            if (whitespaceRegExp.test(inputName)) {
                error = '配色名は空白文字のみで入力することはできません';
            }

            if (charRegExp.test(inputName)) {
                error = '配色名に「<」「>」「&」「"」「\'」「\\」を使用することはできません';
            }

            if (error) {
                this.#$colorDesignPatternNameError.textContent = error;
                this.#$addColorDesignPattern.disabled = true;
            } else {
                this.#$colorDesignPatternNameError.textContent = '';
                this.#$addColorDesignPattern.disabled = false;
            }
        });
        this.#$addColorDesignPattern.disabled = true;
        this.#$colorDesignPatternName.value = '';
        this.#$colorDesignPatternName.disabled = true;

        this.#$addColorDesignPattern.addEventListener('click', () => {

            const inputName = this.#$colorDesignPatternName.value;
            const indexArray = [];
            this.#$colorDesignListOfColors.querySelectorAll('.tool-color-design-area__picked-color-bar').forEach($bar => {
                indexArray.push(parseInt($bar.dataset.colorInfoId));
            });
            const colorInfoOrderedList = indexArray.map(d => this.#droppedColorInfoMap[d]);

            onAddColorDesignPattern({
                patternName: inputName,
                colorInfoList: colorInfoOrderedList
            });

        });
    }

    getControllersUsingWithArrowKey() {
        return [ this.#$colorDesignPatternName ];
    }

    setColorInfoFromPatternInfoIfConfirmed(patternInfo) {

        if (!this.#completeSettingColorInfo) {
            return;
        }

        if (Object.values(this.#droppedColorInfoMap).length === 0
          || confirm('現在編集中の配色を破棄して選択した配色を読み込みますか？')) {

            this.#completeSettingColorInfo = false;
            const $bars = this.#$colorDesignListOfColors.querySelectorAll('.tool-color-design-area__picked-color-bar');
            $bars.forEach($bar => this.#removeColorInfo($bar));
            let colorInfoIndex = 0;
            const setColorInfoWithDelay = () => {
                const colorInfo = patternInfo.colorInfoList[colorInfoIndex];
                this.#setColorInfo(colorInfo);
                colorInfoIndex++;
                if (colorInfoIndex === patternInfo.colorInfoList.length) {
                    this.#completeSettingColorInfo = true;
                    return;
                }
                setTimeout(setColorInfoWithDelay, 200);
            };
            setColorInfoWithDelay();

            this.#$colorDesignPatternName.disabled = false;
            this.#$colorDesignPatternName.value = patternInfo.patternName;
            this.#$colorDesignPatternNameError.textContent = '';
            this.#$addColorDesignPattern.disabled = false;
        }
    }

    #setColorInfo(colorInfo) {

        const id = this.#generateBarId();
        colorInfo.id = id;
        this.#droppedColorInfoMap[id] = colorInfo;
        const colorBar = colorTemplate(colorInfo);
        this.#$colorDesignListOfColors.insertAdjacentHTML('beforeend', colorBar);
        const bars = this.#$colorDesignListOfColors.querySelectorAll('.tool-color-design-area__picked-color-bar');
        const $newBar = bars[bars.length - 1];
        this.#setUpBarElement($newBar);
        this.#scatterChart.appendData(colorInfo);

        $newBar.addEventListener('dragover', e => {
            e.preventDefault();
        });

        $newBar.addEventListener('dragstart', e => {

            $newBar.classList.add('dragging');
            this.#$movingBar = $newBar;
            e.dataTransfer.effectAllowed = 'move';
            e.dataTransfer.setData('text/html', $newBar.innerHTML);

        });

        $newBar.addEventListener('drop', e => {

            if (this.#$movingBar && this.#$movingBar !== $newBar) {

                const movingBarColorInfoId = this.#$movingBar.dataset.colorInfoId;

                this.#$movingBar.innerHTML = $newBar.innerHTML;
                this.#$movingBar.dataset.colorInfoId = $newBar.dataset.colorInfoId;

                $newBar.innerHTML = e.dataTransfer.getData('text/html');
                $newBar.dataset.colorInfoId = movingBarColorInfoId;
                this.#setUpBarElement(this.#$movingBar);
                this.#setUpBarElement($newBar);
                this.#$movingBar = undefined;
            }

            e.preventDefault();
        });

        $newBar.addEventListener('dragenter', () => {
            if (this.#$movingBar) {
                $newBar.classList.add('over');
            }
        });

        $newBar.addEventListener('dragleave', () => {
            $newBar.classList.remove('over');
        });

        $newBar.addEventListener('dragend', () => {

            $newBar.classList.remove('dragging');
            const $bars = this.#$colorDesignListOfColors.querySelectorAll('.tool-color-design-area__picked-color-bar');
            $bars.forEach($bar => {
                $bar.classList.remove('over');
            });
            const $barDelMarks = this.#$colorDesignListOfColors.querySelectorAll('.tool-color-design-area__picked-color-bar-del');
            $barDelMarks.forEach($mark => {
                $mark.style.display = 'none';
            });

        });

        this.#toggleListOfColorsText();
        this.#$tabInput.checked = true;
        CommonEventDispatcher.hideColorPointerPinView();
    }

    #generateBarId() {
        const ret = this.#droppedBarCounter;
        this.#droppedBarCounter++;
        return ret;
    }

    #setUpBarElement($element) {

        const colorInfoId = $element.dataset.colorInfoId;
        $element.style.backgroundColor = this.#droppedColorInfoMap[colorInfoId].colorCode;
        const $newBarDelMark = $element.querySelector('.tool-color-design-area__picked-color-bar-del');

        $newBarDelMark.addEventListener('click', () => {
            this.#removeColorInfo($element);
        });

        $element.addEventListener('mouseover', () => {
            $newBarDelMark.style.display = 'inline-block';
        });

        $element.addEventListener('mouseout', () => {
            $newBarDelMark.style.display = 'none';
        });

        $newBarDelMark.style.display = 'none';
    }

    #removeColorInfo($element) {
        const colorInfoId = $element.dataset.colorInfoId;
        delete this.#droppedColorInfoMap[colorInfoId];
        $element.remove();
        this.#toggleListOfColorsText();
        this.#scatterChart.removeData(parseInt(colorInfoId));
    }

    #toggleListOfColorsText() {
        if (this.#$colorDesignListOfColors.querySelectorAll('.tool-color-design-area__picked-color-bar').length === 0) {
            this.#$colorDesignListOfColorsText.style.display = 'block';
            this.#$colorDesignPatternName.disabled = true;
            this.#$colorDesignPatternName.value = '';
            this.#$addColorDesignPattern.disabled = true;
        } else {
            this.#$colorDesignListOfColorsText.style.display = 'none';
            this.#$colorDesignPatternName.disabled = false;
        }
    }
}
