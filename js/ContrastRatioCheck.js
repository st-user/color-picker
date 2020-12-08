
import ContrastRatioCalculator from './ContrastRatioCalculator.js';
import HsvRgbConverter from './HsvRgbConverter.js';


const pickedColorTemplate = data => {
  return `
    <div class="contrastRatioPickedColorBar pickedColorBar" style="background-color: ${data.colorCode};" data-color-info-id="${data.id}" draggable="true">
      <span class="pickedColorText">${data.colorCode}</span>
    </div>
  `;
};



export default class ContrastRatioCheck {

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

            const dataTransferred = event.dataTransfer.getData('text/plain');
            if (!dataTransferred) {
              return;
            }

            if (this.#isSwapping) {
              this.#swappColors();
              return;
            }

            if (dataTransferred.indexOf('#') === 0) {

              const $existingBar = $element.querySelector('.contrastRatioPickedColorBar');
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

            event.preventDefault();

          });
      };

      preventDefaultOnDragover(this.#$contrastRatioPickedColor1);
      preventDefaultOnDragover(this.#$contrastRatioPickedColor2);

      setPickedColor(this.#$contrastRatioPickedColor1, l => this.#colorInfo1 = l);
      setPickedColor(this.#$contrastRatioPickedColor2, l => this.#colorInfo2 = l);

  }

  #swappColors() {
    const colorInfo1 = this.#colorInfo1;
    const colorInfo2 = this.#colorInfo2;

    this.#colorInfo2 = colorInfo1;
    this.#colorInfo1 = colorInfo2;

    this.#renewColorBar(this.#$contrastRatioPickedColor1, this.#colorInfo1.colorCode);
    this.#renewColorBar(this.#$contrastRatioPickedColor2, this.#colorInfo2.colorCode);

    this.#reflectContrastRatioInfo();
  }

  #renewColorBar($element, colorCode) {

    const $existingBar = $element.querySelector('.contrastRatioPickedColorBar');

    if ($existingBar) {
      $existingBar.remove();
    }

    if (!colorCode) {
      return;
    }

    const id = this.#generateBarId();
    const colorBar = pickedColorTemplate({
      id: id, colorCode: colorCode
    });

    $element.insertAdjacentHTML('beforeend', colorBar);
    this.#setUpBarEvent($element, colorCode);;
  }

  #setUpBarEvent($element, colorCode) {

    const $newBar = $element.querySelector('.contrastRatioPickedColorBar');

    $newBar.addEventListener('dragstart', event => {
      this.#isSwapping = true;
      event.dataTransfer.effectAllowed = 'move';
      event.dataTransfer.setData('text/plain', colorCode);
    });

    $newBar.addEventListener('dragend', event => this.#isSwapping = false);
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
    $element.querySelectorAll('.contrastRatioCheckCriteriaSample').forEach($text => {
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

    this.#checkSuccessCriteria(this.#$contrastRatioCheckCriteriaNormal, ratio, 4.5, 7);
    this.#checkSuccessCriteria(this.#$contrastRatioCheckCriteriaLarge, ratio, 3, 4.5);
  }

  #checkSuccessCriteria($element, ratio, criteriaAA, criteriaAAA) {

    this.#checkSuccessCriteriaEach(
      $element,
      '.contrastRatioCheckCriteriaAA',
      ratio,
      criteriaAA
    );

    this.#checkSuccessCriteriaEach(
      $element,
      '.contrastRatioCheckCriteriaAAA',
      ratio,
      criteriaAAA
    );
  }

  #checkSuccessCriteriaEach($element, elSelector, ratio, criteria) {

    const result = criteria <= ratio ? 'OK' : 'NG';
    const addClass = criteria <= ratio ? 'criteriaOK' : 'criteriaNG';
    const removeClass = criteria <= ratio ? 'criteriaNG' : 'criteriaOK';

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
