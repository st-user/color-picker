
import ContrastRatioCalculator from './ContrastRatioCalculator.js';
import HsvRgbConverter from './HsvRgbConverter.js';
import ContrastRatioAutoExtractionCondition from './ContrastRatioAutoExtractionCondition.js';
import ContrastRatioExplanations from './ContrastRatioExplanations.js';

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
      <td style="background-color: ${data.colorCode};" class="pickedColorText">${data.colorCode}</td>
      <td>${data.score}</td>
    </tr>
  `;
};


export default class ContrastRatioAutoExtraction {

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
  #targetColorMap;

  #droppedBarCounter;
  #workers;

  constructor() {

      this.#explanations = new ContrastRatioExplanations(
          '#contrastRatioExtractionTitle .contrastRatioExplanationClose',
          '#contrastRatioExtractionTitle .contrastRatioExplanationOpen',
          '#contrastRatioAutoExtractionArea .contrastRatioFunctionExplanations'
      );

      this.#$contrastRatioExtractionAreaContents = document.querySelector('#contrastRatioExtractionAreaContents');
      this.#$contrastRatioExtractionTitle = document.querySelector('#contrastRatioExtractionTitle');

      this.#$contrastRatioTargetColorList = document.querySelector('#contrastRatioTargetColorList');
      this.#$contrastRatioResultColorList = document.querySelector('#contrastRatioResultColorList');

      this.#$contrastRatioExtractHighestRatios = document.querySelector('#contrastRatioExtractHighestRatios');

      this.#$contrastRatioResultColorTable = document.querySelector('#contrastRatioResultColorTable');
      this.#$contrastRatioResultColorListBody = document.querySelector('#contrastRatioResultColorListBody');
      this.#$contrastRatioResultColorExecuting = document.querySelector('#contrastRatioResultColorExecuting');
      this.#$contrastRatioResultColorMessage = document.querySelector('#contrastRatioResultColorMessage');

      this.#isOpened = false;
      this.#isDraggingTargetColor = false;
      this.#condition = new ContrastRatioAutoExtractionCondition();
      this.#isExecuting = false;
      this.#targetColorMap = {};

      this.#droppedBarCounter = 0;

      this.#workers = [];

  }

  setUpEvent() {

      const toggleArea = () => {
          const $triangle = this.#$contrastRatioExtractionTitle.querySelector('.openCloseTriangle');
          this.#isOpened = !this.#isOpened;
          if (this.#isOpened) {
              $triangle.classList.remove('triangleClose');
              $triangle.classList.add('triangleOpen');
              this.#$contrastRatioExtractionAreaContents.style.display = 'block';
          } else {
              $triangle.classList.remove('triangleOpen');
              $triangle.classList.add('triangleClose');
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
              this.#appendToColorList(colorCode);


          } else {

              const patternInfo = JSON.parse(dataTransferred);
              patternInfo.colorInfoList.forEach(
                  colorInfo => this.#appendToColorList(colorInfo.colorCode)
              );

          }
      });

      this.#$contrastRatioExtractHighestRatios.addEventListener('click', event => {

          if (this.#isExecuting || !this.#checkCondition()) {
              return;
          }
          this.#showMessageOnExecution();
          this.#executeAutoExtraction();

      });

      toggleArea();
      this.#refleshResultState(0);

      this.#explanations.setUpEvent();
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

      this.#makeSingleBarDraggable($newBar, colorCode, true);

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

      this.#toggleListOfColorsText();
  }

  #makeSingleBarDraggable($element, colorCode, isTargetColor) {
      $element.addEventListener('dragstart', event => {
          this.#isDraggingTargetColor = isTargetColor;
          $element.classList.add('dragging');
          event.dataTransfer.effectAllowed = 'move';
          event.dataTransfer.setData('text/plain', colorCode);
      });

      $element.addEventListener('dragend', event => {
          this.#isDraggingTargetColor = false;
          $element.classList.remove('dragging');
      });
  }

  #removeColorInfo($newBar) {
      const colorInfoId = $newBar.dataset.colorInfoId;
      delete this.#targetColorMap[colorInfoId];
      $newBar.remove();
      this.#toggleListOfColorsText();
  }

  #toggleListOfColorsText() {
      const $bars = this.#$contrastRatioTargetColorList.querySelectorAll('.contrastRatioPickedColorBar');
      const $message = this.#$contrastRatioTargetColorList.querySelector('.drappableAreaMessage');
      if ($bars.length === 0) {
          $message.style.display = 'block';
      } else {
          $message.style.display = 'none';
      }
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
          this.#$contrastRatioExtractHighestRatios.classList.add('disabled');
      } else {
          this.#$contrastRatioExtractHighestRatios.classList.remove('disabled');
      }
      this.#$contrastRatioResultColorTable.style.display = tableDisplay;
      this.#$contrastRatioResultColorExecuting.style.display = animationDisplay;
      this.#$contrastRatioResultColorMessage.style.display = messageDisplay;
  }

  #executeAutoExtraction() {

      this.#isExecuting = true;

      const conditions = this.#condition.createConditionsForCalculators();

      let processedTaskCount = 0;
      const threadCount = this.#condition.getThreadCount();
      let resultFromWrokers = [];
      const numberOfResults = this.#condition.getContrastRatioExtractionCount();
      let currentMinScore = -Infinity;
      let error = false;

      for (let i = 0; i < threadCount; i++) {
          let worker = this.#workers[i];
          if (!worker) {
              worker = new Worker('js/contrast-ratio-auto-extraction-worker.js?q=' + window.APP_VERSION);
              this.#workers[i] = worker;
              worker.onerror = () => {
                  alert('処理実行中にエラーが発生しました。ネットワークの切断などの問題が発生した可能性があります。');
                  error = true;
                  this.#workers.forEach(w => w.terminate());
                  this.#workers = [];
                  this.#showExtractionResult([]);
              };
          }

          const postMessage = () => {

              if (error) {
                  return;
              }

              const condition = conditions[processedTaskCount];
              processedTaskCount++;
              worker.postMessage({
                  condition: condition,
                  targetColors: Object.values(this.#targetColorMap),
                  currentMinScore: currentMinScore
              });
          };

          worker.onmessage = event => {

              if (error) {
                  return;
              }

              event.data.results.filter(result => currentMinScore < result.avg)
                  .forEach(result => resultFromWrokers.push(result));

              if (!currentMinScore || numberOfResults < resultFromWrokers.length) {
                  resultFromWrokers.sort((a, b) => b.avg - a.avg);
                  resultFromWrokers = resultFromWrokers.slice(0, numberOfResults);
                  currentMinScore = resultFromWrokers[resultFromWrokers.length - 1].avg;
              }

              if (processedTaskCount < conditions.length) {
                  postMessage();
              } else {
                  this.#showExtractionResult(resultFromWrokers);
              }
          };

          postMessage();
      }


  }

  #showExtractionResult(resultFromWrokers) {

      const $existingBars = this.#$contrastRatioResultColorListBody.querySelectorAll('.contrastRatioResultColorBar');
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

      const $newBars = this.#$contrastRatioResultColorListBody.querySelectorAll('.contrastRatioResultColorBar');
      $newBars.forEach(($newBar, i) => {
          const colorCode = appendedColorCodes[i];
          this.#makeSingleBarDraggable($newBar, colorCode, false);
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

  #generateBarId() {
      const ret = this.#droppedBarCounter;
      this.#droppedBarCounter++;
      return ret;
  }
}
