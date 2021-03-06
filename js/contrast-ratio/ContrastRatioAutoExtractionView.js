import { CommonEventDispatcher } from 'vncho-lib';

import ColorListModel from '../common/ColorListModel.js';
import ContrastRatioAutoExtractionConditionView from './ContrastRatioAutoExtractionConditionView.js';
import ContrastRatioAutoExtractionService from './ContrastRatioAutoExtractionService.js';
import ContrastRatioExplanationsView from './ContrastRatioExplanationsView.js';
import CustomEventNames from '../common/CustomEventNames.js';
import HsvRgbConverter from '../common/HsvRgbConverter.js';

const targetColorTemplate = data => {
    return `
    <div class="tool-contrast-ratio-area__picked-color-bar" style="background-color: ${data.colorCode};" data-color-info-id="${data.id}" draggable="true">
      <span class="tool-contrast-ratio-area__picked-color-bar-text">${data.colorCode}</span>
      <span class="tool-contrast-ratio-area__pick-color-bar-del">×</span>
    </div>
  `;
};

const resultColorTemplate = data => {
    return `
    <tr class="tool-contrast-ratio-area__auto-extraction-result-color-bar" draggable="true">
      <td style="background-color: ${data.colorCode};" class="tool-contrast-ratio-area__picked-color-bar-text">${data.colorCode}</td>
      <td>${data.score}</td>
    </tr>
  `;
};


export default class ContrastRatioAutoExtractionView {

    #targetColorListModel;
    #contrastRatioCheckModel;

    #explanations;

    #$contrastRatioExtractionAreaContents;
    #$contrastRatioExtractionTitle;
    #isOpened;

    #$contrastRatioTargetColorList;
    #$contrastRatioResultColorList;

    #$contrastRatioExtractHighestRatios;

    #$contrastRatioResultColorTable;
    #$contrastRatioResultColorListBody;
    #$contrastRatioResultColorExecuting;
    #$contrastRatioResultColorMessage;
    #animationOnExecutionTimer;

    #isDraggingTargetColor;
    #condition;
    #isExecuting;

    #service;

    constructor(contrastRatioCheckModel) {

        this.#targetColorListModel = new ColorListModel(
            CustomEventNames.COLOR_PICKER__ADD_CONTRAST_RATIO_AUTO_EXTRACTION_TARGET_COLOR,
            CustomEventNames.COLOR_PICKER__REMOVE_CONTRAST_RATIO_AUTO_EXTRACTION_TARGET_COLOR
        );
        this.#contrastRatioCheckModel = contrastRatioCheckModel;

        this.#explanations = new ContrastRatioExplanationsView(
            '#contrastRatioExtractionTitle .tool-contrast-ratio-area__explanations-to-close',
            '#contrastRatioExtractionTitle .tool-contrast-ratio-area__explanations-to-open',
            '#contrastRatioAutoExtractionArea .tool-contrast-ratio-area__function-explanations'
        );

        this.#$contrastRatioExtractionAreaContents = document.querySelector('#contrastRatioExtractionAreaContents');
        this.#$contrastRatioExtractionTitle = document.querySelector('#contrastRatioExtractionTitle');
        this.#isOpened = false;

        this.#$contrastRatioTargetColorList = document.querySelector('#contrastRatioTargetColorList');
        this.#$contrastRatioResultColorList = document.querySelector('#contrastRatioResultColorList');

        this.#$contrastRatioExtractHighestRatios = document.querySelector('#contrastRatioExtractHighestRatios');

        this.#$contrastRatioResultColorTable = document.querySelector('#contrastRatioResultColorTable');
        this.#$contrastRatioResultColorListBody = document.querySelector('#contrastRatioResultColorListBody');
        this.#$contrastRatioResultColorExecuting = document.querySelector('#contrastRatioResultColorExecuting');
        this.#$contrastRatioResultColorMessage = document.querySelector('#contrastRatioResultColorMessage');

        this.#isDraggingTargetColor = false;
        this.#condition = new ContrastRatioAutoExtractionConditionView();
        this.#isExecuting = false;

        this.#service = new ContrastRatioAutoExtractionService();
    }

    setUpEvent() {

        const toggleArea = () => {
            const $triangle = this.#$contrastRatioExtractionTitle.querySelector('.tool-contrast-ratio-area__auto-extraction-title-toggle-mark');
            this.#isOpened = !this.#isOpened;
            if (this.#isOpened) {
                $triangle.classList.remove('is-closed');
                $triangle.classList.add('is-opened');
                this.#$contrastRatioExtractionAreaContents.style.display = 'block';
            } else {
                $triangle.classList.remove('is-opened');
                $triangle.classList.add('is-closed');
                this.#$contrastRatioExtractionAreaContents.style.display = 'none';
            }
        };

        this.#$contrastRatioExtractionTitle.addEventListener('click', toggleArea);

        this.#$contrastRatioTargetColorList.addEventListener('dragover', event => {
            event.preventDefault();
        });

        this.#$contrastRatioTargetColorList.addEventListener('drop', event => {
            event.preventDefault();

            const dataTransferred = event.dataTransfer.getData('text/plain');
            if (this.#isDraggingTargetColor || !dataTransferred) {
                return;
            }

            if (dataTransferred.indexOf('#') === 0) {

                const colorCode = dataTransferred;
                this.#targetColorListModel.addOneColorCode(colorCode);

            } else {

                const patternInfo = JSON.parse(dataTransferred);
                this.#targetColorListModel.addColorCodeList(patternInfo.colorCodes);

            }
        });

        this.#$contrastRatioExtractHighestRatios.addEventListener('click', () => {

            if (this.#isExecuting || !this.#checkCondition()) {
                return;
            }
            this.#showMessageOnExecution();
            this.#executeAutoExtraction();

        });


        CommonEventDispatcher.on(CustomEventNames.COLOR_PICKER__ADD_CONTRAST_RATIO_AUTO_EXTRACTION_TARGET_COLOR, event => {
            const colorInfos = event.detail.addedItemInfos;
            colorInfos.forEach(colorInfo => this.#renderColorList(colorInfo.id, colorInfo.item));
        });

        CommonEventDispatcher.on(CustomEventNames.COLOR_PICKER__REMOVE_CONTRAST_RATIO_AUTO_EXTRACTION_TARGET_COLOR, event => {
            const ids = event.detail.ids;
            ids.forEach(id => this.#removeColorInfoById(id));
        });

        toggleArea();
        this.#refleshResultState(0);

        this.#explanations.setUpEvent();
        this.#condition.setUpEvent();
    }

    #renderColorList(id, color) {

        const colorCode = color.getColorCode();
        const colorBar = targetColorTemplate({
            id: id,
            colorCode: colorCode
        });

        this.#$contrastRatioTargetColorList.insertAdjacentHTML('beforeend', colorBar);

        const $bars = this.#$contrastRatioTargetColorList.querySelectorAll('.tool-contrast-ratio-area__picked-color-bar');
        const $newBar = $bars[$bars.length - 1];
        const $newBarDelMark = $newBar.querySelector('.tool-contrast-ratio-area__pick-color-bar-del');

        this.#makeSingleBarDraggable($newBar, colorCode, true);

        $newBarDelMark.addEventListener('click', () => {
            this.#targetColorListModel.removeById(id);
        });

        $newBar.addEventListener('dblclick', () => {
            this.#contrastRatioCheckModel.setBackgroundColorFromColorCode(colorCode);
        });

        $newBar.addEventListener('mouseover', () => {
            $newBarDelMark.style.display = 'inline-block';
        });

        $newBar.addEventListener('mouseout', () => {
            $newBarDelMark.style.display = 'none';
        });

        $newBarDelMark.style.display = 'none';

        this.#toggleListOfColorsText();
    }

    #makeSingleBarDraggable($element, colorCode, isTargetColor) {
        $element.addEventListener('dragstart', event => {
            this.#isDraggingTargetColor = isTargetColor;
            $element.classList.add('is-dragging');
            event.dataTransfer.effectAllowed = 'move';
            event.dataTransfer.setData('text/plain', colorCode);
        });

        $element.addEventListener('dragend', () => {
            this.#isDraggingTargetColor = false;
            $element.classList.remove('is-dragging');
        });
    }

    #removeColorInfoById(idInteger) {
        const $bars = this.#$contrastRatioTargetColorList.querySelectorAll('.tool-contrast-ratio-area__picked-color-bar');
        $bars.forEach($bar => {
            if(parseInt($bar.dataset.colorInfoId) === idInteger) {
                $bar.remove();
            }
        });
        this.#toggleListOfColorsText();
    }

    #toggleListOfColorsText() {
        const $message = this.#$contrastRatioTargetColorList.querySelector('.tool-contrast-ratio-area__auto-extraction-target-color-list-message');
        if (this.#targetColorListModel.isEmpty()) {
            $message.style.display = 'block';
        } else {
            $message.style.display = 'none';
        }
    }

    #checkCondition() {
        if (this.#targetColorListModel.isEmpty()) {
            alert('抽出元となる色が選択されていません');
            return false;
        }
        return true;
    }

    #showMessageOnExecution() {

        this.#setResultMessageState(true, 'none', 'block', 'none');

        let markerCount = 0;
        const $animationText = this.#$contrastRatioResultColorExecuting.querySelector('#waitingAnimationText');
        $animationText.textContent = 'START!!';
        this.#animationOnExecutionTimer = setInterval(() => {
            if (markerCount % 10 === 0) {
                $animationText.textContent = '';
            } else {
                $animationText.insertAdjacentHTML('beforeend', '■');
            }
            markerCount++;

        }, 1000);
    }

    #setResultMessageState(btnDisabled, tableDisplay, animationDisplay, messageDisplay) {

        if (btnDisabled) {
            this.#$contrastRatioExtractHighestRatios.classList.add('is-disabled');
        } else {
            this.#$contrastRatioExtractHighestRatios.classList.remove('is-disabled');
        }
        this.#$contrastRatioResultColorTable.style.display = tableDisplay;
        this.#$contrastRatioResultColorExecuting.style.display = animationDisplay;
        this.#$contrastRatioResultColorMessage.style.display = messageDisplay;
    }

    #executeAutoExtraction() {

        this.#isExecuting = true;

        const targetColorLuminances = this.#targetColorListModel.getItems().map(
            color => color.calcLuminance()
        );
        this.#service.doService(
            targetColorLuminances,
            this.#condition.createConditions(),
            this.#condition.getThreadCount()
        ).then(result => {
            this.#showExtractionResult(result.scoreWithRgbs);
        }).catch(result => {
            const alertMsg = result.error || '処理実行中にエラーが発生しました';
            alert(alertMsg);
            this.#showExtractionResult([]);
        });
    }

    #showExtractionResult(resultFromWrokers) {

        const $existingBars = this.#$contrastRatioResultColorListBody.querySelectorAll('.tool-contrast-ratio-area__auto-extraction-result-color-bar');
        $existingBars.forEach($existingBar => $existingBar.remove());

        const appendedColorCodes = [];

        for (const result of resultFromWrokers) {

            const colorCode = HsvRgbConverter.rgbToColorCode(result.r, result.g, result.b);
            appendedColorCodes.push(colorCode);

            const resultBar = resultColorTemplate({
                colorCode: colorCode,
                score: Math.round(result.avg * 100) / 100
            });

            this.#$contrastRatioResultColorListBody.insertAdjacentHTML('beforeend', resultBar);
        }

        const $newBars = this.#$contrastRatioResultColorListBody.querySelectorAll('.tool-contrast-ratio-area__auto-extraction-result-color-bar');
        $newBars.forEach(($newBar, i) => {
            const colorCode = appendedColorCodes[i];
            this.#makeSingleBarDraggable($newBar, colorCode, false);
            $newBar.addEventListener('dblclick', () => {
                this.#contrastRatioCheckModel.setTextColorFromColorCode(colorCode);
            });
        });

        this.#refleshResultState(resultFromWrokers.length);
    }

    #refleshResultState(resultCount) {

        this.#isExecuting = false;

        this.#setResultMessageState(false, 'none', 'none', 'none');
        clearTimeout(this.#animationOnExecutionTimer);

        if (0 < resultCount) {
            this.#$contrastRatioResultColorTable.style.display = 'block';
            this.#$contrastRatioResultColorMessage.style.display = 'none';
        } else {
            this.#$contrastRatioResultColorTable.style.display = 'none';
            this.#$contrastRatioResultColorMessage.style.display = 'block';
        }
    }


}
