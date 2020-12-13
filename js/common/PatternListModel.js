import Color from '../common/Color.js';
import ListModel from '../common/ListModel.js';
import Pattern from '../common/Pattern.js';

export default class PatternListModel extends ListModel {

    constructor(eventNameOnAdd, eventNameOnRemove, maxSize) {
        super(eventNameOnAdd, eventNameOnRemove, maxSize);
    }

    addOnePattern(patternName, colors) {
        super.addOne(new Pattern(patternName, colors));
    }

    addPatternList(patterns) {
        super.addList(patterns);
    }

    toStorageObject() {
        return this.getItems().map(pattern => {
            return {
                patternName: pattern.getPatternName(),
                colorInfoList: pattern.toColorInfoList()
            };
        });
    }

    addStorageObject(obj) {
        const patterns = obj.map(patternInfo => {
            const colors = patternInfo.colorInfoList.map(
                colorInfo => new Color({ colorCode: colorInfo.colorCode })
            );
            return new Pattern(patternInfo.patternName, colors);
        });
        this.addPatternList(patterns);
    }
}
