export default class Pattern {

    #patternName;
    #colors;

    constructor(patternName, colors) {
        this.#patternName = patternName;
        this.#colors = colors;
    }

    getPatternName() {
        return this.#patternName;
    }

    getColors() {
        return this.#colors;
    }

    toColorInfoList() {
        return this.#colors.map(color => {
            return { colorCode: color.getColorCode() };
        });
    }
}
