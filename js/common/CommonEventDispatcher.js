import CustomEventNames from '../common/CustomEventNames.js';

const CommonEventDispatcher = (() => {

    const $mainOvserver = document.createElement('div');

    return {

        hideColorPointerPinView: () => {
            $mainOvserver.dispatchEvent(new CustomEvent(CustomEventNames.COLOR_PICKER__HIDE_COLOR_POINTER_PIN));
        },

        dispatch: (eventName, detail) => {
            $mainOvserver.dispatchEvent(new CustomEvent(eventName, {
                detail: detail
            }));
        },

        on(eventName, handler) {
            $mainOvserver.addEventListener(eventName, handler);
        }
    };
})();

export default CommonEventDispatcher;
