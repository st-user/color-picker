import ColorListModel from '../common/ColorListModel.js';

export default class PatternColorListModel extends ColorListModel {

    #completeSettingColorInfo;

    constructor(eventNameOnAdd, eventNameOnRemove) {
        super(eventNameOnAdd, eventNameOnRemove);
        this.#completeSettingColorInfo = true;
    }

    addColorCodesWithDelayIfConfirmed(colorCodes) {

        if (!this.#completeSettingColorInfo) {
            return false;
        }

        if (!this.isEmpty() && !confirm('現在編集中の配色を破棄して選択した配色を読み込みますか？')) {
            return false;
        }

        this.#completeSettingColorInfo = false;
        this.removeAll();

        let colorInfoIndex = 0;
        const setColorInfoWithDelay = () => {
            this.addOneColorCode(colorCodes[colorInfoIndex]);

            colorInfoIndex++;
            if (colorInfoIndex === colorCodes.length) {
                this.#completeSettingColorInfo = true;
                return;
            }
            setTimeout(setColorInfoWithDelay, 200);
        };
        setColorInfoWithDelay();

        return true;
    }
}
