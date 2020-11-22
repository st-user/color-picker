import StorageAccessor from './StorageAccessor.js';

const template = data => {
  return `
    <div class="historyColorBar" data-color-code="${data.colorCode}">
      <div style="background-color: ${data.colorCode};" class="historyColorCode"></div>
      <div>${data.colorCode}</div>
    </div>
  `
}

const STORAGE_KEY = 'colorCodeHistories';

export default class ColorCodeHistories {

  #$historiesListArea;
  #$storeHistoriesAutomatically;
  #$clearHistories;
  #colorCodes;

  #$observerOnClickHistory;

  constructor() {
    this.#$historiesListArea = document.querySelector('#historiesListArea');
    this.#$storeHistoriesAutomatically = document.querySelector('#storeHistoriesAutomatically');
    this.#$clearHistories = document.querySelector('#clearHistories');
    this.#colorCodes = [];

    this.#$observerOnClickHistory = document.createElement('div');
  }

  setUpEvents() {
    this.#$clearHistories.addEventListener('click', () => {
      if(confirm('全ての履歴が削除されますがよろしいですか？')) {
        this.#$historiesListArea.innerHTML = '';
        this.#colorCodes.length = 0;
        StorageAccessor.removeItem(STORAGE_KEY);
      }
    });
    const storedColorCodes = StorageAccessor.getObject(STORAGE_KEY);
    if (storedColorCodes) {
      storedColorCodes.forEach(cc => this.addColorCode(cc, false));
    }
  }

  onChangeAutomationState(handler) {

    this.#$storeHistoriesAutomatically.addEventListener('change', () => {
      handler(this.#$storeHistoriesAutomatically.checked);
    });
  }

  onClickHistory(handler) {
    this.#$observerOnClickHistory.addEventListener('historyClick', event => {
      const colorCode = event.detail
      handler(colorCode);
    });
  }

  addColorIfAutomatic(newColorCode) {
    if (this.#$storeHistoriesAutomatically.checked) {
        this.addColorCode(newColorCode, false);
    }
  }

  addColorCode(newColorCode, needsAlert) {
    const colorCodes = this.#colorCodes;
    const isSameColorCode = newColorCode === colorCodes[colorCodes.length - 1];

    if (isSameColorCode) {
      if (needsAlert) {
        alert('直近の履歴と相違がないため、履歴に追加されませんでした');
      }
      return;
    }

    colorCodes.push(newColorCode);
    this.#$historiesListArea.insertAdjacentHTML('afterbegin',
      template({ colorCode: newColorCode })
    );
    const $newHistory = this.#$historiesListArea.querySelectorAll('.historyColorBar')[0];
    $newHistory.addEventListener('click', event => {
      const customEvent = new CustomEvent('historyClick',
        { detail: newColorCode }
      );
      this.#$observerOnClickHistory.dispatchEvent(customEvent);
    });
    StorageAccessor.setObject(STORAGE_KEY, this.#colorCodes);
  }

}
