
import ContrastRatioCalculator from './ContrastRatioCalculator.js';
import HsvRgbConverter from './HsvRgbConverter.js';
import ContrastRatioAutoExtractionCondition from './ContrastRatioAutoExtractionCondition.js';


const targetColorTemplate = data => {
  return `
    <div class="contrastRatioPickedColorBar pickedColorBar" style="background-color: ${data.colorCode};" data-color-info-id="${data.id}" draggable="true">
      <span class="pickedColorText">${data.colorCode}</span>
      <span class="pickedColorDel">×</span>
    </div>
  `;
};

const resultColorTemplate = data => {
  return `
    <tr class="contrastRatioResultColorBar" draggable="true">
      <td style="background-color: ${data.colorCode};">${data.colorCode}</td>
      <td>${data.score}</td>
    </tr>
  `;
};


export default class ContrastRatioAutoExtraction {

  #$contrastRatioTargetColorList;
  #$contrastRatioResultColorList;

  #$contrastRatioExtractHighestRatios;

  #$contrastRatioResultColorTable;
  #$contrastRatioResultColorListBody;
  #$contrastRatioResultColorExecuting;
  #$contrastRatioResultColorMessage;
  #animationOnExecutionTimer;

  #condition;
  #targetColorMap;

  #droppedBarCounter;
  #workers;

  constructor() {
    this.#$contrastRatioTargetColorList = document.querySelector('#contrastRatioTargetColorList');
    this.#$contrastRatioResultColorList = document.querySelector('#contrastRatioResultColorList');

    this.#$contrastRatioExtractHighestRatios = document.querySelector('#contrastRatioExtractHighestRatios');

    this.#$contrastRatioResultColorTable = document.querySelector('#contrastRatioResultColorTable');
    this.#$contrastRatioResultColorListBody = document.querySelector('#contrastRatioResultColorListBody');
    this.#$contrastRatioResultColorExecuting = document.querySelector('#contrastRatioResultColorExecuting');
    this.#$contrastRatioResultColorMessage = document.querySelector('#contrastRatioResultColorMessage');

    this.#condition = new ContrastRatioAutoExtractionCondition();
    this.#targetColorMap = {};

    this.#droppedBarCounter = 0;

    this.#workers = [];

  }

  setUpEvent() {

    this.#$contrastRatioTargetColorList.addEventListener('dragover', event => {
      event.preventDefault();
    });

    this.#$contrastRatioTargetColorList.addEventListener('drop', event => {

      const dataTransferred = event.dataTransfer.getData('text/plain');
      if (!dataTransferred) {
        return;
      }

      if (dataTransferred.indexOf('#') === 0) {

        const colorCode = dataTransferred;
        this.#appendToColorList(colorCode);


      } else {

        const patternInfo = JSON.parse(dataTransferred);
        patternInfo.colorInfoList.forEach(
          colorInfo => this.#appendToColorList(colorInfo.colorCode)
        );

      }

      event.preventDefault();
    });

    this.#$contrastRatioExtractHighestRatios.addEventListener('click', event => {

      if (!this.#checkCondition()) {
        return;
      }
      this.#showMessageOnExecution();
      this.#executeAutoExtraction();

    });

    this.#refleshResultState(0);

    this.#condition.setUpEvent();
  }

  #appendToColorList(colorCode) {

    const id = this.#generateBarId();
    const colorBar = targetColorTemplate({
      id: id, colorCode: colorCode
    });
    const r = HsvRgbConverter.colorCodeToR(colorCode);
    const g = HsvRgbConverter.colorCodeToG(colorCode);
    const b = HsvRgbConverter.colorCodeToB(colorCode);
    this.#targetColorMap[id] = { colorCode: colorCode, r: r, g: g, b: b };

    this.#$contrastRatioTargetColorList.insertAdjacentHTML('beforeend', colorBar);

    const $bars = this.#$contrastRatioTargetColorList.querySelectorAll('.contrastRatioPickedColorBar');
    const $newBar = $bars[$bars.length - 1];
    const $newBarDelMark = $newBar.querySelector('.pickedColorDel');

    this.#makeSingleBarDraggable($newBar, colorCode);

    $newBarDelMark.addEventListener('click', e => {
      this.#removeColorInfo($newBar);
    });

    $newBar.addEventListener('mouseover', e => {
      $newBarDelMark.style.display = 'inline-block';
    });

    $newBar.addEventListener('mouseout', e => {
      $newBarDelMark.style.display = 'none';
    });

    $newBarDelMark.style.display = 'none';
  }

  #makeSingleBarDraggable($element, colorCode) {
    $element.addEventListener('dragstart', event => {
      event.dataTransfer.effectAllowed = 'move';
      event.dataTransfer.setData('text/plain', colorCode);
    });
  }

  #removeColorInfo($newBar) {
    const colorInfoId = $newBar.dataset.colorInfoId;
    delete this.#targetColorMap[colorInfoId]
    $newBar.remove();
    this.#toggleListOfColorsText();
  }

  #toggleListOfColorsText($element, colorCode) {

  }

  #checkCondition() {
    if (Object.values(this.#targetColorMap).length === 0) {
      alert('抽出元となる色が選択されていません');
      return false;
    }
    return true;
  }

  #showMessageOnExecution() {

      this.#setResultMessageState(true, 'none', 'block', 'none');

      let markerCount = 0;
      const $animationText = this.#$contrastRatioResultColorExecuting.querySelector('.waitingAnimationText');
      $animationText.textContent = '■';
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
    this.#$contrastRatioExtractHighestRatios.disabled = btnDisabled;
    this.#$contrastRatioResultColorTable.style.display = tableDisplay;
    this.#$contrastRatioResultColorExecuting.style.display = animationDisplay;
    this.#$contrastRatioResultColorMessage.style.display = messageDisplay;
  }

  #executeAutoExtraction() {

    const conditions = this.#condition.createConditionsForCalculators();
    let workerCount = conditions.length;
    const resultFromWrokers = [];
    const numberOfResults = conditions[0].numberOfResults;

    conditions.forEach((condition, i) => {

      console.log(condition);

      let worker = this.#workers[i];
      if (!worker) {
          worker = new Worker('js/contrast-ratio-auto-extraction-worker.js?q=' + window.APP_VERSION);
          this.#workers[i] = worker;
      }

      worker.onmessage = event => {
        workerCount--;
        event.data.results.forEach(result => resultFromWrokers.push(result));

        if (workerCount == 0) {
          const results = resultFromWrokers.slice(0, numberOfResults)
          this.#showExtractionResult(results);
        }
      };

      worker.postMessage({
        condition: condition,
        targetColors: Object.values(this.#targetColorMap)
      });

    })

  }

  #showExtractionResult(resultFromWrokers) {

    const $existingBars = this.#$contrastRatioResultColorListBody.querySelectorAll('.contrastRatioResultColorBar');
    $existingBars.forEach($existingBar => $existingBar.remove());

    resultFromWrokers.sort((a, b) => b.avg - a.avg);
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

    const $newBars = this.#$contrastRatioResultColorListBody.querySelectorAll('.contrastRatioResultColorBar');
    $newBars.forEach(($newBar, i) => {
      const colorCode = appendedColorCodes[i];
      this.#makeSingleBarDraggable($newBar, colorCode);
    });

    this.#refleshResultState(resultFromWrokers.length);
  }

  #refleshResultState(resultCount) {

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

  #generateBarId() {
    const ret = this.#droppedBarCounter;
    this.#droppedBarCounter++;
    return ret;
  }
}
