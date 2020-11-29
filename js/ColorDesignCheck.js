import HsvRgbConverter from "./HsvRgbConverter.js";
import ScatterChart from "./ScatterChart.js";

const whitespaceRegExp = /^\s+$/;
const charRegExp = /[<>&"'\\]/;

const colorTemplate = data => {
  return `
    <div class="colorDesignPickedColorBar" data-color-info-id="${data.id}" draggable="true">
      <span class="colorDesignPickedColorText">${data.colorCode}</span>
      <span class="colorDesignPickedColorDel">×</span>
    </div>
  `;
};


export default class ColorDesignCheck {

  #$colorDesignListOfColors;
  #$colorDesignListOfColorsText;

  #droppedBarCounter;
  #droppedColorInfoMap;
  #$movingBar;

  #scatterChart;

  #$colorDesignPatternName;
  #$addColorDesignPattern;
  #$colorDesignPatternNameError;

  constructor() {

    this.#$colorDesignListOfColors = document.querySelector('#colorDesignListOfColors');
    this.#$colorDesignListOfColorsText = document.querySelector('#colorDesignListOfColorsText');

    this.#droppedBarCounter = 0;
    this.#droppedColorInfoMap = {};

    this.#scatterChart = new ScatterChart();

    this.#$colorDesignPatternName = document.querySelector('#colorDesignPatternName');
    this.#$addColorDesignPattern = document.querySelector('#addColorDesignPattern');
    this.#$colorDesignPatternNameError = document.querySelector('#colorDesignPatternNameError');
  }

  setUpEvents(onAddColorDesignPattern) {

    this.#$colorDesignListOfColors.addEventListener('dragover', e => {
      e.preventDefault();
    });

    this.#$colorDesignListOfColors.addEventListener('drop', e => {

      const colorCode = e.dataTransfer.getData('text/plain');
      if (!colorCode) {
        return;
      }
      const r = HsvRgbConverter.colorCodeToR(colorCode);
      const g = HsvRgbConverter.colorCodeToG(colorCode);
      const b = HsvRgbConverter.colorCodeToB(colorCode);
      const hsv = HsvRgbConverter.rgbToHsv(r, g, b);
      const hsl = HsvRgbConverter.hsvToHsl(hsv.h, hsv.s / 100, hsv.v / 100);

      const colorInfo = {
        id: this.#generateBarId(),
        colorCode: colorCode,
        rgb: { r: r, g: b, b: b },
        hsv: hsv,
        hsl: hsl
      };
      this.#setColorInfo(colorInfo);
    });

    this.#$colorDesignPatternName.addEventListener('keyup', e => {

      const inputName = this.#$colorDesignPatternName.value;
      let error;
      if (!inputName) {
        error = '配色名を入力してください';
      }

      if (whitespaceRegExp.test(inputName)) {
        error = '配色名は空白文字のみで入力することはできません';
      }

      if (charRegExp.test(inputName)) {
        error = '配色名に<,>,&,\",\',\\を使用することはできません';
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

    this.#$addColorDesignPattern.addEventListener('click', e => {

      const inputName = this.#$colorDesignPatternName.value;
      const indexArray = [];
      this.#$colorDesignListOfColors.querySelectorAll('.colorDesignPickedColorBar').forEach($bar => {
        indexArray.push(parseInt($bar.dataset.colorInfoId));
      });
      const colorInfoOrderedList = indexArray.map(d => this.#droppedColorInfoMap[d]);

      onAddColorDesignPattern({
        patternName: inputName,
        colorInfoList: colorInfoOrderedList
      });

    });
  }

  setColorInfoFromPatternInfoIfConfirmed(patternInfo) {

    if (Object.values(this.#droppedColorInfoMap).length === 0
          || confirm('現在編集中の配色を破棄してクリックした履歴を読み込みますか？')) {

      const $bars = this.#$colorDesignListOfColors.querySelectorAll('.colorDesignPickedColorBar');
      $bars.forEach($bar => this.#removeColorInfo($bar));
      patternInfo.colorInfoList.forEach(colorInfo => this.#setColorInfo(colorInfo));
      this.#$colorDesignPatternName.disabled = false;
      this.#$colorDesignPatternName.value = patternInfo.patternName;
      this.#$addColorDesignPattern.disabled = false;
    }
  }

  #setColorInfo(colorInfo) {

    this.#droppedColorInfoMap[colorInfo.id] = colorInfo;
    const colorBar = colorTemplate(colorInfo);
    this.#$colorDesignListOfColors.insertAdjacentHTML('beforeend', colorBar);
    const bars = this.#$colorDesignListOfColors.querySelectorAll('.colorDesignPickedColorBar');
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
    });

    $newBar.addEventListener('dragenter', e => {
      if (this.#$movingBar) {
          $newBar.classList.add('over');
      }
    });

    $newBar.addEventListener('dragleave', e => {
      $newBar.classList.remove('over');
    });

    $newBar.addEventListener('dragend', e => {

      $newBar.classList.remove('dragging');
      const $bars = this.#$colorDesignListOfColors.querySelectorAll('.colorDesignPickedColorBar');
      $bars.forEach($bar => {
        $bar.classList.remove('over');
      });
      const $barDelMarks = this.#$colorDesignListOfColors.querySelectorAll('.colorDesignPickedColorDel');
      $barDelMarks.forEach($mark => {
        $mark.style.display = 'none';
      });

    });

    this.#toggleListOfColorsText();
  }

  #generateBarId() {
    const ret = this.#droppedBarCounter;
    this.#droppedBarCounter++;
    return ret;
  }

  #setUpBarElement($element) {

    const colorInfoId = $element.dataset.colorInfoId;
    $element.style.backgroundColor = this.#droppedColorInfoMap[colorInfoId].colorCode;
    const $newBarDelMark = $element.querySelector('.colorDesignPickedColorDel');

    $newBarDelMark.addEventListener('click', e => {
      this.#removeColorInfo($element);
    });

    $element.addEventListener('mouseover', e => {
      $newBarDelMark.style.display = 'inline-block';
    });

    $element.addEventListener('mouseout', e => {
      $newBarDelMark.style.display = 'none';
    });

    $newBarDelMark.style.display = 'none';
  }

  #removeColorInfo($element) {
    const colorInfoId = $element.dataset.colorInfoId;
    delete this.#droppedColorInfoMap[colorInfoId]
    $element.remove();
    this.#toggleListOfColorsText();
    this.#scatterChart.removeData(parseInt(colorInfoId));
  }

  #toggleListOfColorsText() {
    if (this.#$colorDesignListOfColors.querySelectorAll('.colorDesignPickedColorBar').length === 0) {
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
