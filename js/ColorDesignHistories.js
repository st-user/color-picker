
import StorageAccessor from './StorageAccessor.js';

const template = data => {
  let background;
  if (1 < data.colorInfoList.length) {
    background = `background: linear-gradient(to right, ${data.colorInfoList.map(d => d.colorCode).join(',')});`;
  } else {
    background = `background-color: ${data.colorInfoList[0].colorCode}`;
  }
  return `
    <div class="historyColorDesignBar historyBar shadow" data-pattern-id="${data.patternId}">
      <div class="historyColorDesignName">${data.patternName}</div>
      <div class="historyColorDesignGradient" style="${background}"></div>
    </div>
  `;
};

const HISTORY_MAX_SIZE = 30;
const STORAGE_KEY = 'colorDesignHistories';

export default class ColorDesignHistories {

  #$colorDesignHistoriesListArea;
  #$tabInput;
  #$clearHistories;

  #patternMap;

  #$observerOnClickHistory;
  #patternCounter;

  constructor() {
    this.#$colorDesignHistoriesListArea = document.querySelector('#colorDesignHistoriesListArea');
    this.#$tabInput = document.querySelector('#colorDesignHistoryTabTitle');
    this.#$clearHistories = document.querySelector('#clearColorDesignHistories');
    this.#patternMap = {};

    this.#$observerOnClickHistory = document.createElement('div');
    this.#patternCounter = 0;
  }

  setUpEvents() {
    this.#$clearHistories.addEventListener('click', () => {
      if(confirm('全ての履歴が削除されますがよろしいですか？')) {
        this.#$colorDesignHistoriesListArea.innerHTML = '';
        this.#patternMap = {};
        StorageAccessor.removeItem(STORAGE_KEY);
      }
    });
    const storedPatterns = StorageAccessor.getObject(STORAGE_KEY);
    if (storedPatterns) {
      storedPatterns.forEach(p => this.#addHistory(p));
    }
  }

  onClickHistory(handler) {
    this.#$observerOnClickHistory.addEventListener('historyClick', event => {
      const patternInfo = event.detail
      handler(patternInfo);
    });
  }

  addHistoryIfPatternNameIsValid(patternData) {


    this.#addHistory(patternData);
  }

  #addHistory(patternInfo) {

    const patternId = this.#generatePatternId();
    this.#patternMap[patternId] = patternInfo;

    this.#$colorDesignHistoriesListArea.insertAdjacentHTML('afterbegin', template({
      patternId: patternId,
      patternName: patternInfo.patternName,
      colorInfoList: patternInfo.colorInfoList
    }));

    const $newHistory = this.#$colorDesignHistoriesListArea.querySelectorAll('.historyColorDesignBar')[0];
    $newHistory.addEventListener('click', event => {
      const customEvent = new CustomEvent('historyClick',
        { detail: patternInfo }
      );
      this.#$observerOnClickHistory.dispatchEvent(customEvent);
    });

    StorageAccessor.setObject(STORAGE_KEY, Object.values(this.#patternMap));
    this.#$tabInput.checked = true;
  }

  #generatePatternId() {
    const ret = this.#patternCounter;
    this.#patternCounter++;
    return ret;
  }
}
