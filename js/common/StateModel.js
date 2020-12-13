import CommonEventDispatcher from '../common/CommonEventDispatcher.js';

export default class StateModel {

    #eventName;
    #stateValue;

    constructor(eventName, stateDefaultValue) {
        this.#eventName = eventName;
        this.#stateValue = stateDefaultValue;
    }

    getStateValue() {
        return this.#stateValue;
    }

    setStateValue(stateValue) {
        this.#stateValue = stateValue;
        CommonEventDispatcher.dispatch(this.#eventName, {
            stateValue: this.#stateValue
        });
    }
}
