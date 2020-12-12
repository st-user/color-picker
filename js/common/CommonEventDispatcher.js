import CustomEventNames from './CustomEventNames.js';

const CommonEventDispatcher = (() => {

    return {

        hideColorPointerPin: () => {
            document.dispatchEvent(new CustomEvent(CustomEventNames.COLOR_PICKER__HIDE_COLOR_POINTER_PIN));
        }

    };
})();

export default CommonEventDispatcher;
