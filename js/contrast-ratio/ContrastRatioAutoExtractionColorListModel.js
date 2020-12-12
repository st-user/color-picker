import CustomEventNames from '../common/CustomEventNames.js';
import Color from '../common/Color.js';

export default class ContrastRatioAutoExtractionColorListModel {

    #colorMap;
    #idCounter;

    constructor() {
        this.#colorMap = {};
        this.#idCounter = 0;
    }

    isEmpty() {
        return this.getColors().length === 0;
    }

    getColors() {
        return Object.values(this.#colorMap);
    }

    addOneColorCode(colorCode) {
        const color = new Color({
            colorCode: colorCode
        });
        const id = this.#generateId();
        this.#colorMap[id] = color;
        this.#dispatchEventOnAdd([{
            id: id,
            color: color
        }]);
    }

    addColorCodeList(colorCodes) {
        const colors = colorCodes.map(colorCode => new Color({
            colorCode: colorCode
        }));
        const colorInfos = colors.map(color => {
            const id = this.#generateId();
            this.#colorMap[id] = color;
            return {
                id: id,
                color, color
            };
        });
        this.#dispatchEventOnAdd(colorInfos);
    }

    removeById(id) {
        delete this.#colorMap[id]
        this.#dispatchEventOnRemove(id);
    }

    #dispatchEventOnAdd(colorInfos) {
        document.dispatchEvent(new CustomEvent(CustomEventNames.COLOR_PICKER__ADD_CONTRAST_RATIO_AUTO_EXTRACTION_TARGET_COLOR, {
            detail: {
                addedColorInfos: colorInfos
            }
        }));
    }

    #dispatchEventOnRemove(id) {
        document.dispatchEvent(new CustomEvent(CustomEventNames.COLOR_PICKER__REMOVE_CONTRAST_RATIO_AUTO_EXTRACTION_TARGET_COLOR, {
            detail: {
                id: id
            }
        }));
    }

    #generateId() {
        const ret = this.#idCounter;
        this.#idCounter++;
        return ret;
    }
}
