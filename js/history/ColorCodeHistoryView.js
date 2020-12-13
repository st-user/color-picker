import CommonEventDispatcher from '../common/CommonEventDispatcher.js';
import CustomEventNames from '../common/CustomEventNames.js';
import StorageAccessor from '../common/StorageAccessor.js';

const template = data => {
    return `
    <div class="history-content-area__history-color-bar clearfixContainer" data-id="${data.id}" draggable="true">
      <div style="background-color: ${data.colorCode};" class="history-content-area__history-color-bar-color-mark"></div>
      <div class="history-content-area__history-color-bar-color-code">${data.colorCode}</div>
    </div>
  `;
};

const STORAGE_KEY = 'colorCodeHistories';

export default class ColorCodeHistoryView {

    #colorModel;
    #colorListModel;

    #$historiesListArea;
    #$tabInput;
    #$clearHistories;

    constructor(colorModel, colorListModel) {

        this.#colorModel = colorModel;
        this.#colorListModel = colorListModel;

        this.#$historiesListArea = document.querySelector('#historiesListArea');
        this.#$tabInput = document.querySelector('#colorCodeHistoryTabTitle');
        this.#$clearHistories = document.querySelector('#clearHistories');
    }

    setUpEvents() {
        this.#$clearHistories.addEventListener('click', () => {
            if(confirm('全ての履歴が削除されますがよろしいですか？')) {
                this.#colorListModel.removeAll();
            }
        });

        CommonEventDispatcher.on(CustomEventNames.COLOR_PICKER__ADD_COLOR_CODE_TO_HISTORY, event => {
            const colorInfos = event.detail.addedItemInfos;
            colorInfos.forEach(colorInfo => this.#renderOneHistory(colorInfo.id, colorInfo.item));
            this.#updateStorage();
        });

        CommonEventDispatcher.on(CustomEventNames.COLOR_PICKER__REMOVE_COLOR_CODE_TO_HISTORY, event => {
            const ids = event.detail.ids;
            this.#removeHistoryByIds(ids);
            this.#updateStorage();
        });

        const storedColorCodes = StorageAccessor.getObject(STORAGE_KEY);
        if (storedColorCodes) {
            this.#colorListModel.addColorCodeList(storedColorCodes);
        }
    }

    #renderOneHistory(id, color) {

        const colorCode = color.getColorCode();
        this.#$historiesListArea.insertAdjacentHTML('afterbegin',
            template({
                id: id,
                colorCode: colorCode
            })
        );

        const $newHistory = this.#$historiesListArea.querySelectorAll('.history-content-area__history-color-bar')[0];
        $newHistory.addEventListener('click', () => {
            this.#colorModel.setEventContextInfo({
                isHistoryClickContext: true
            });
            this.#colorModel.setColorCode(colorCode);
        });

        $newHistory.addEventListener('dragstart', e => {
            e.dataTransfer.effectAllowed = 'move';
            e.dataTransfer.setData('text/plain', colorCode);
        });
        this.#$tabInput.checked = true;
    }

    #removeHistoryByIds(idsInt) {
        const $histories = this.#$historiesListArea.querySelectorAll('.history-content-area__history-color-bar');
        $histories.forEach($history => {
            if (idsInt.includes(parseInt($history.dataset.id))) {
                $history.remove();
            }
        });
    }

    #updateStorage() {
        if (this.#colorListModel.isEmpty()) {
            StorageAccessor.removeItem(STORAGE_KEY);
        } else {
            const colorCodes = this.#colorListModel.getOrderedItems().map(color => color.getColorCode());
            StorageAccessor.setObject(STORAGE_KEY, colorCodes);
        }
    }
}
