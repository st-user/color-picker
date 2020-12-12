import StorageAccessor from '../common/StorageAccessor.js';
import CustomEventNames from '../common/CustomEventNames.js';
import Constants from '../common/Constants.js';
import debounce from '../common/Debounce.js';

const template = data => {
    return `
    <div class="history-content-area__history-color-bar historyBar shadow clearfixContainer" data-color-code="${data.colorCode}" draggable="true">
      <div style="background-color: ${data.colorCode};" class="history-content-area__history-color-bar-color-mark"></div>
      <div class="history-content-area__history-color-bar-color-code">${data.colorCode}</div>
    </div>
  `;
};

const HISTORY_MAX_SIZE = 30;
const STORAGE_KEY = 'colorCodeHistories';

export default class ColorCodeHistoryView {

    #colorModel;
    #isHistoryUpdateAutomatically;
    #isHistoryClickContext;

    #$historiesListArea;
    #$tabInput;

    #$clearHistories;

    #colorCodes;

    constructor(colorModel) {

        this.#colorModel = colorModel;

        this.#$historiesListArea = document.querySelector('#historiesListArea');
        this.#$tabInput = document.querySelector('#colorCodeHistoryTabTitle');
        this.#$clearHistories = document.querySelector('#clearHistories');
        this.#colorCodes = [];
    }

    setUpEvents() {
        this.#$clearHistories.addEventListener('click', () => {
            if(confirm('全ての履歴が削除されますがよろしいですか？')) {
                this.#$historiesListArea.innerHTML = '';
                this.#colorCodes.length = 0;
                StorageAccessor.removeItem(STORAGE_KEY);
            }
        });

        document.addEventListener(CustomEventNames.COLOR_PICKER__UPDATE_COLOR_CODE_HISTORY, event => {
            const color = event.detail.color;
            this.#addColorCode(color.getColorCode(), true);
        });

        document.addEventListener(CustomEventNames.COLOR_PICKER__CHANGE_STATE_OF_AUTO_HISTORY_UPDATE, event => {
            const stateValue = event.detail.stateValue;
            this.#isHistoryUpdateAutomatically = stateValue;
        });

        document.addEventListener(CustomEventNames.COLOR_PICKER__CHANGE_COLOR_ON_COLOR_CONTROL_VIEW, debounce(event => {
            const current = this.#isHistoryClickContext;
            this.#isHistoryClickContext = false;
            if (current || !this.#isHistoryUpdateAutomatically) {
                this.#isHistoryClickContext = false;
                return;
            }
            const color = event.detail.color;
            this.#addColorCode(color.getColorCode(), false);
        }, 500));

        this.#isHistoryUpdateAutomatically = Constants.AUTO_HISTORY_UPDATE_STATE_DEFAULT;
        this.#isHistoryClickContext = false;

        const storedColorCodes = StorageAccessor.getObject(STORAGE_KEY);
        if (storedColorCodes) {
            storedColorCodes.forEach(cc => this.#addColorCode(cc, false));
        }
    }

    #addColorCode(newColorCode, needsAlert) {
        const colorCodes = this.#colorCodes;
        const isSameColorCode = newColorCode === colorCodes[colorCodes.length - 1];

        if (isSameColorCode) {
            if (needsAlert) {
                alert('直近の履歴と相違がないため、履歴に追加されませんでした');
            }
            return;
        }

        const $allHistories = this.#$historiesListArea.querySelectorAll('.history-content-area__history-color-bar');
        if (colorCodes.length === HISTORY_MAX_SIZE) {
            colorCodes.shift();
            $allHistories[$allHistories.length - 1].remove();
        }

        colorCodes.push(newColorCode);
        this.#$historiesListArea.insertAdjacentHTML('afterbegin',
            template({ colorCode: newColorCode })
        );

        const $newHistory = this.#$historiesListArea.querySelectorAll('.history-content-area__history-color-bar')[0];
        $newHistory.addEventListener('click', () => {
            this.#isHistoryClickContext = true;
            this.#colorModel.setColorCode(newColorCode);
        });

        $newHistory.addEventListener('dragstart', e => {
            e.dataTransfer.effectAllowed = 'move';
            e.dataTransfer.setData('text/plain', newColorCode);
        });
        StorageAccessor.setObject(STORAGE_KEY, this.#colorCodes);
        this.#$tabInput.checked = true;
    }

}
