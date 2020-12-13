import Color from '../common/Color.js';
import ListModel from '../common/ListModel.js';

export default class ColorListModel extends ListModel {

    constructor(eventNameOnAdd, eventNameOnRemove, maxSize) {
        super(eventNameOnAdd, eventNameOnRemove, maxSize);
    }

    addOneColorCode(colorCode) {
        const color = new Color({
            colorCode: colorCode
        });
        super.addOne(color);
    }

    addColorCodeList(colorCodes) {
        const colors = colorCodes.map(colorCode => new Color({
            colorCode: colorCode
        }));
        super.addList(colors);
    }
}
