import ScatterChart from './ScatterChart.js';
import CommonEventDispatcher from '../common/CommonEventDispatcher.js';
import CustomEventNames from '../common/CustomEventNames.js';


const colorTemplate = data => {
    return `
    <div class="tool-color-design-area__picked-color-bar" data-color-info-id="${data.id}" draggable="true">
      <span class="tool-color-design-area__picked-color-bar-text">${data.colorCode}</span>
      <span class="tool-color-design-area__picked-color-bar-del">×</span>
    </div>
  `;
};


export default class ColorDesignView {

    #listOfColorsModel;
    #patternInputModel;
    #colorDesignHistoryPatternListModel;

    #$colorDesignListOfColors;
    #$colorDesignListOfColorsText;
    #$tabInput;

    #$movingBar;

    #scatterChart;

    #$colorDesignPatternName;
    #$addColorDesignPattern;
    #$colorDesignPatternNameError;


    constructor(listOfColorsModel, patternInputModel, colorDesignHistoryPatternListModel) {

        this.#listOfColorsModel = listOfColorsModel;
        this.#patternInputModel = patternInputModel;
        this.#colorDesignHistoryPatternListModel = colorDesignHistoryPatternListModel;

        this.#$colorDesignListOfColors = document.querySelector('#colorDesignListOfColors');
        this.#$colorDesignListOfColorsText = document.querySelector('#colorDesignListOfColorsText');
        this.#$tabInput = document.querySelector('#colorDesignAreaTabTitle');

        this.#scatterChart = new ScatterChart();

        this.#$colorDesignPatternName = document.querySelector('#colorDesignPatternName');
        this.#$addColorDesignPattern = document.querySelector('#addColorDesignPattern');
        this.#$colorDesignPatternNameError = document.querySelector('#colorDesignPatternNameError');
    }

    setUpEvents() {

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
                this.#listOfColorsModel.addOneColorCode(colorCode);

            } else {

                const patternInfo = JSON.parse(dataTransferred);
                this.#doReflectPatternInfoIfConfirmed(patternInfo);
            }

            e.preventDefault();

        });

        this.#$colorDesignPatternName.addEventListener('keyup', () => {
            this.#patternInputModel.setName(this.#$colorDesignPatternName.value);
        });

        this.#$addColorDesignPattern.addEventListener('click', () => {

            const inputName = this.#$colorDesignPatternName.value;
            const orderedIdArray = [];
            this.#$colorDesignListOfColors.querySelectorAll('.tool-color-design-area__picked-color-bar').forEach($bar => {
                orderedIdArray.push(parseInt($bar.dataset.colorInfoId));
            });
            const colors = orderedIdArray.map(id => this.#listOfColorsModel.getItemById(id));

            this.#colorDesignHistoryPatternListModel.addOnePattern(
                inputName, colors
            );
        });

        document.addEventListener(CustomEventNames.COLOR_PICKER__ADD_COLOR_DESIGN_TARGET_COLOR, event => {
            const colorInfos = event.detail.addedItemInfos;
            colorInfos.forEach(colorInfo => this.#renderColorInfo(colorInfo.id, colorInfo.item));
        });

        document.addEventListener(CustomEventNames.COLOR_PICKER__REMOVE_COLOR_DESIGN_TARGET_COLOR, event => {
            const ids = event.detail.ids;
            ids.forEach(id => this.#removeColorInfoById(id));
        });

        document.addEventListener(CustomEventNames.COLOR_PICKER__INPUT_COLOR_DESIGN_PATTERN_NAME, event => {
            const error = event.detail.error;
            this.#renderPatternInput(error);
        });

        this.#renderPatternInputFrom(true, true, '', '');
    }

    getControllersUsingWithArrowKey() {
        return [ this.#$colorDesignPatternName ];
    }

    #doReflectPatternInfoIfConfirmed(patternInfo) {
        const confirmed = this.#listOfColorsModel.addColorCodesWithDelayIfConfirmed(patternInfo.colorCodes);
        if (confirmed) {
            this.#patternInputModel.setName(patternInfo.patternName);
        }
    }

    #renderColorInfo(id, color) {

        const data = {
            id: id,
            colorCode: color.getColorCode()
        };
        const colorBar = colorTemplate(data);
        this.#$colorDesignListOfColors.insertAdjacentHTML('beforeend', colorBar);
        const bars = this.#$colorDesignListOfColors.querySelectorAll('.tool-color-design-area__picked-color-bar');
        const $newBar = bars[bars.length - 1];
        this.#setUpBarElement($newBar);
        this.#scatterChart.appendData({
            id: id,
            color: color
        });

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

    #setUpBarElement($element) {

        const colorInfoId = $element.dataset.colorInfoId;
        const color = this.#listOfColorsModel.getItemByIdString(colorInfoId);
        $element.style.backgroundColor = color.getColorCode();
        const $newBarDelMark = $element.querySelector('.tool-color-design-area__picked-color-bar-del');

        $newBarDelMark.addEventListener('click', () => {
            this.#listOfColorsModel.removeById(parseInt(colorInfoId));
        });

        $element.addEventListener('mouseover', () => {
            $newBarDelMark.style.display = 'inline-block';
        });

        $element.addEventListener('mouseout', () => {
            $newBarDelMark.style.display = 'none';
        });

        $newBarDelMark.style.display = 'none';
    }

    #removeColorInfoById(idInteger) {
        const $bars = this.#$colorDesignListOfColors.querySelectorAll('.tool-color-design-area__picked-color-bar');
        $bars.forEach($bar => {
            if (parseInt($bar.dataset.colorInfoId) === idInteger) {
                $bar.remove();
            }
        });
        this.#toggleListOfColorsText();
        this.#scatterChart.removeData(idInteger);
    }

    #toggleListOfColorsText() {

        if (this.#listOfColorsModel.isEmpty()) {

            this.#$colorDesignListOfColorsText.style.display = 'block';
            this.#renderPatternInputFrom(true, true, '', '');

        } else {

            this.#$colorDesignListOfColorsText.style.display = 'none';
            this.#renderPatternInput(this.#patternInputModel.getCurrentError());
        }
    }

    #renderPatternInput(error) {
        const buttonDisabled = !!(error);
        this.#renderPatternInputFrom(false, buttonDisabled, this.#patternInputModel.getName(), error);
    }

    #renderPatternInputFrom(textDisabled, buttonDisabled, patternName, error) {
        this.#$colorDesignPatternName.disabled = textDisabled;
        this.#$addColorDesignPattern.disabled = buttonDisabled;
        this.#$colorDesignPatternName.value = patternName;
        this.#$colorDesignPatternNameError.textContent = error;
    }
}
