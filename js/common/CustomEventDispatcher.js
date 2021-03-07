import { CommonEventDispatcher } from 'vncho-lib';
import CustomEventNames from './CustomEventNames.js';

const hideColorPointerPinView = () => {
    CommonEventDispatcher.dispatch(CustomEventNames.COLOR_PICKER__HIDE_COLOR_POINTER_PIN);
};

export {
    hideColorPointerPinView
};