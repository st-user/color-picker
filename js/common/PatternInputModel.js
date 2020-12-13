import CustomEventNames from '../common/CustomEventNames.js';

const whitespaceRegExp = /^\s+$/;
const charRegExp = /[<>&"'\\]/;

const checkIfNameIsEmpty = name => {
    if (!name) {
        return '配色名を入力してください';
    }
    return undefined;
};

const checkIfNameContainsSpaceOnly = name => {
    if (whitespaceRegExp.test(name)) {
        return '配色名は空白文字のみで入力することはできません';
    }
    return undefined;
};

const checkIfNameContainsIllegalChar = name => {
    if (charRegExp.test(name)) {
        return '配色名に「<」「>」「&」「"」「\'」「\\」を使用することはできません';
    }
    return undefined;
};

export default class PatternInputModel {

    #patternName;
    #currentError;

    constructor() {
        this.#patternName = '';
        this.#currentError = '';
    }

    setName(name) {

        let error = '';

        error = error || checkIfNameIsEmpty(name);
        error = error || checkIfNameContainsSpaceOnly(name);
        error = error || checkIfNameContainsIllegalChar(name);

        this.#patternName = name;
        this.#currentError = error;
        this.#dispatchEvent(error);
    }

    getName() {
        return this.#patternName;
    }

    getCurrentError() {
        return this.#currentError;
    }

    #dispatchEvent(error) {
        document.dispatchEvent(new CustomEvent(CustomEventNames.COLOR_PICKER__INPUT_COLOR_DESIGN_PATTERN_NAME, {
            detail: {
                error: error
            }
        }));
    }
}
