import CommonEventDispatcher from '../common/CommonEventDispatcher.js';
import CustomEventNames from '../common/CustomEventNames.js';
import StorageAccessor from '../common/StorageAccessor.js';

const template = data => {
    let background;
    if (1 < data.colorCodes.length) {
        background = `background: linear-gradient(to right, ${data.colorCodes.join(',')});`;
    } else {
        background = `background-color: ${data.colorCodes[0]}`;
    }
    return `
    <div class="history-content-area__history-color-design-bar" data-pattern-id="${data.patternId}" draggable="true">
      <div class="history-content-area__history-color-design-bar-name">${data.patternName}</div>
      <div class="history-content-area__history-color-design-bar-gradient" style="${background}"></div>
    </div>
  `;
};

const STORAGE_KEY = 'colorDesignHistories';

export default class ColorDesignHistoryView {

    #colorDesignCheckListOfColorModel;
    #colorDesignCheckPatternInputModel;

    #patternListModel;
    #initializing;

    #$colorDesignHistoryViewListArea;
    #$tabInput;
    #$clearHistories;

    constructor(colorDesignCheckListOfColorModel, colorDesignCheckPatternInputModel, patternListModel) {

        this.#colorDesignCheckListOfColorModel = colorDesignCheckListOfColorModel;
        this.#colorDesignCheckPatternInputModel = colorDesignCheckPatternInputModel;
        this.#patternListModel = patternListModel;
        this.#initializing = true;

        this.#$colorDesignHistoryViewListArea = document.querySelector('#colorDesignHistoriesListArea');
        this.#$tabInput = document.querySelector('#colorDesignHistoryTabTitle');
        this.#$clearHistories = document.querySelector('#clearColorDesignHistories');
    }

    setUpEvents() {
        this.#$clearHistories.addEventListener('click', () => {
            if(confirm('全ての履歴が削除されますがよろしいですか？')) {
                this.#patternListModel.removeAll();
            }
        });

        CommonEventDispatcher.on(CustomEventNames.COLOR_PICKER__ADD_PATTERN_TO_HISTORY, event => {
            const patterns = event.detail.addedItemInfos;
            patterns.forEach(pattern => this.#renderOneHistory(pattern.id, pattern.item));
            this.#updateStorage();
        });

        CommonEventDispatcher.on(CustomEventNames.COLOR_PICKER__REMOVE_PATTERN_TO_HISTORY, event => {
            const ids = event.detail.ids;
            this.#removeHistoryByIds(ids);
            this.#updateStorage();
        });

        const storedPatterns = StorageAccessor.getObject(STORAGE_KEY);
        if (storedPatterns) {
            this.#patternListModel.addStorageObject(storedPatterns);
        }
        this.#initializing = false;
    }

    #renderOneHistory(id, pattern) {

        const colorCodes = pattern.getColors().map(color => color.getColorCode());
        const data = {
            patternId: id,
            patternName: pattern.getPatternName(),
            colorCodes: colorCodes
        };
        this.#$colorDesignHistoryViewListArea.insertAdjacentHTML('afterbegin', template(data));

        const $newHistory = this.#$colorDesignHistoryViewListArea.querySelectorAll('.history-content-area__history-color-design-bar')[0];

        $newHistory.addEventListener('click', () => {

            const confirmed = this.#colorDesignCheckListOfColorModel.addColorCodesWithDelayIfConfirmed(colorCodes);
            if (confirmed) {
                this.#colorDesignCheckPatternInputModel.setName(pattern.getPatternName());
            }
        });
        $newHistory.addEventListener('dragstart', e => {
            e.dataTransfer.effectAllowed = 'move';
            e.dataTransfer.setData('text/plain', JSON.stringify(data));
        });

        this.#$tabInput.checked = !this.#initializing;
    }

    #removeHistoryByIds(idsInt) {
        const $histories = this.#$colorDesignHistoryViewListArea.querySelectorAll('.history-content-area__history-color-design-bar');
        $histories.forEach($history => {
            if (idsInt.includes(parseInt($history.dataset.patternId))) {
                $history.remove();
            }
        });
    }

    #updateStorage() {
        if (this.#patternListModel.isEmpty()) {
            StorageAccessor.removeItem(STORAGE_KEY);
        } else {
            StorageAccessor.setObject(STORAGE_KEY, this.#patternListModel.toStorageObject());
        }
    }

}
