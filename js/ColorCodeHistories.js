import StorageAccessor from './StorageAccessor.js';

const template = data => {
    return `
    <div class="historyColorBar historyBar shadow clearfixContainer" data-color-code="${data.colorCode}" draggable="true">
      <div style="background-color: ${data.colorCode};" class="historyColorView"></div>
      <div class="historyColorCode">${data.colorCode}</div>
    </div>
  `;
};

const HISTORY_MAX_SIZE = 30;
const STORAGE_KEY = 'colorCodeHistories';

export default class ColorCodeHistories {

    #$historiesListArea;
    #$tabInput;
    #$storeHistoriesAutomatically;
    #$clearHistories;

    #colorCodes;

    #$observerOnClickHistory;

    constructor() {
        this.#$historiesListArea = document.querySelector('#historiesListArea');
        this.#$tabInput = document.querySelector('#colorCodeHistoryTabTitle');
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
            const colorCode = event.detail;
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

        const $allHistories = this.#$historiesListArea.querySelectorAll('.historyColorBar');
        if (colorCodes.length === HISTORY_MAX_SIZE) {
            colorCodes.shift();
            $allHistories[$allHistories.length - 1].remove();
        }

        colorCodes.push(newColorCode);
        this.#$historiesListArea.insertAdjacentHTML('afterbegin',
            template({ colorCode: newColorCode })
        );


        const $newHistory = this.#$historiesListArea.querySelectorAll('.historyColorBar')[0];
        $newHistory.addEventListener('click', () => {
            const customEvent = new CustomEvent('historyClick',
                { detail: newColorCode }
            );
            this.#$observerOnClickHistory.dispatchEvent(customEvent);
        });
        $newHistory.addEventListener('dragstart', e => {
            e.dataTransfer.effectAllowed = 'move';
            e.dataTransfer.setData('text/plain', newColorCode);
        });
        StorageAccessor.setObject(STORAGE_KEY, this.#colorCodes);
        this.#$tabInput.checked = true;
    }

}
