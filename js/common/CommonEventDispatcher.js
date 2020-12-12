import CustomEventNames from '../common/CustomEventNames.js';

const CommonEventDispatcher = (() => {

    return {

        hideColorPointerPinView: () => {
            document.dispatchEvent(new CustomEvent(CustomEventNames.COLOR_PICKER__HIDE_COLOR_POINTER_PIN));
        }

    };
})();

export default CommonEventDispatcher;
