import StorageAccessor from '../common/StorageAccessor.js';

const template = data => {
    let background;
    if (1 < data.colorInfoList.length) {
        background = `background: linear-gradient(to right, ${data.colorInfoList.map(d => d.colorCode).join(',')});`;
    } else {
        background = `background-color: ${data.colorInfoList[0].colorCode}`;
    }
    return `
    <div class="history-content-area__history-color-design-bar" data-pattern-id="${data.patternId}" draggable="true">
      <div class="history-content-area__history-color-design-bar-name">${data.patternName}</div>
      <div class="history-content-area__history-color-design-bar-gradient" style="${background}"></div>
    </div>
  `;
};

const HISTORY_MAX_SIZE = 30;
const STORAGE_KEY = 'colorDesignHistories';

export default class ColorDesignHistoryView {

    #$colorDesignHistoryViewListArea;
    #$tabInput;
    #$clearHistories;

    #patternMap;

    #$observerOnClickHistory;
    #patternCounter;

    constructor() {
        this.#$colorDesignHistoryViewListArea = document.querySelector('#colorDesignHistoriesListArea');
        this.#$tabInput = document.querySelector('#colorDesignHistoryTabTitle');
        this.#$clearHistories = document.querySelector('#clearColorDesignHistories');
        this.#patternMap = {};

        this.#$observerOnClickHistory = document.createElement('div');
        this.#patternCounter = 0;
    }

    setUpEvents() {
        this.#$clearHistories.addEventListener('click', () => {
            if(confirm('全ての履歴が削除されますがよろしいですか？')) {
                this.#$colorDesignHistoryViewListArea.innerHTML = '';
                this.#patternMap = {};
                StorageAccessor.removeItem(STORAGE_KEY);
            }
        });
        const storedPatterns = StorageAccessor.getObject(STORAGE_KEY);
        if (storedPatterns) {
            storedPatterns.forEach(p => this.#addHistory(p, false));
        }
    }

    onClickHistory(handler) {
        this.#$observerOnClickHistory.addEventListener('historyClick', event => {
            const patternInfo = event.detail;
            handler(patternInfo);
        });
    }

    addHistoryThenShowColorDesignTab(patternData) {
        this.#addHistory(patternData, true);
    }

    #addHistory(patternInfo, selectTab) {

        const patternId = this.#generatePatternId();
        this.#patternMap[patternId] = patternInfo;

        const $histories = this.#$colorDesignHistoryViewListArea.querySelectorAll('.history-content-area__history-color-design-bar');
        if (HISTORY_MAX_SIZE <= $histories.length) {
            const $oldest = $histories[$histories.length - 1];
            const oldestId = $oldest.dataset.dataPatternId;
            delete this.#patternMap[oldestId];
            $oldest.remove();
        }

        this.#$colorDesignHistoryViewListArea.insertAdjacentHTML('afterbegin', template({
            patternId: patternId,
            patternName: patternInfo.patternName,
            colorInfoList: patternInfo.colorInfoList
        }));

        const $newHistory = this.#$colorDesignHistoryViewListArea.querySelectorAll('.history-content-area__history-color-design-bar')[0];
        $newHistory.addEventListener('click', () => {
            const customEvent = new CustomEvent('historyClick',
                { detail: patternInfo }
            );
            this.#$observerOnClickHistory.dispatchEvent(customEvent);
        });
        $newHistory.addEventListener('dragstart', e => {
            e.dataTransfer.effectAllowed = 'move';
            e.dataTransfer.setData('text/plain', JSON.stringify(patternInfo));
        });
        StorageAccessor.setObject(STORAGE_KEY, Object.values(this.#patternMap));
        this.#$tabInput.checked = selectTab;
    }

    #generatePatternId() {
        const ret = this.#patternCounter;
        this.#patternCounter++;
        return ret;
    }
}