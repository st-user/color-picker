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
        document.dispatchEvent(new CustomEvent(this.#eventName, {
            detail: {
                stateValue: this.#stateValue
            }
        }));
    }
}
