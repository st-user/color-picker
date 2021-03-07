import { CustomEventNamesFactory } from 'vncho-lib';

const CustomEventNames = CustomEventNamesFactory.createNames();

CustomEventNames
    /* header */
    .set('COLOR_PICKER__TOGGLE_EXPLANATIONS', 'color-picker/toggle-explanations')
    /* 色編集領域 */
    .set('COLOR_PICKER__CHANGE_COLOR_ON_COLOR_CONTROL_VIEW', 'color-picker/change-color-on-color-control-view')
    .set('COLOR_PICKER__UPDATE_COLOR_CODE_HISTORY', 'color-picker/update-color-code-history')
    .set('COLOR_PICKER__CHANGE_STATE_OF_AUTO_HISTORY_UPDATE', 'color-picker/change-state-of-auto-history-update')
    /* ツール 画像/HSV chart */
    .set('COLOR_PICKER__IMAGE_DATA_POINTED', 'color-picker/image-data-pointed')
    .set('COLOR_PICKER__ARROW_KEY_PRESSED', 'color-picker/arrow-key-pressed')
    .set('COLOR_PICKER__ENABLE_TO_PICK_UP_COLOR_ON_MOUSE_MOVE', 'color-picker/enable-to-pick-up-color-on-mouse-move')
    .set('COLOR_PICKER__IMAGE_FILE_LOADED', 'color-picker/image-file-loaded')
    .set('COLOR_PICKER__HIDE_COLOR_POINTER_PIN', 'color-picker/color-pointer-pin-hide')
    /* コントラスト比 */
    .set('COLOR_PICKER__CHANGE_CONTRAST_RATIO_CHECK_COLOR', 'color-picker/change-contrast-ratio-check-color')
    .set('COLOR_PICKER__ADD_CONTRAST_RATIO_AUTO_EXTRACTION_TARGET_COLOR', 'color-picker/add-contrast-ratio-auto-extraction-target-color')
    .set('COLOR_PICKER__REMOVE_CONTRAST_RATIO_AUTO_EXTRACTION_TARGET_COLOR', 'color-picker/remove-contrast-ratio-auto-extraction-target-color')
    /* 配色チェック */
    .set('COLOR_PICKER__ADD_COLOR_DESIGN_TARGET_COLOR', 'color-picker/add-color-design-target-color')
    .set('COLOR_PICKER__REMOVE_COLOR_DESIGN_TARGET_COLOR', 'color-picker/remove-color-design-target-color')
    .set('COLOR_PICKER__INPUT_COLOR_DESIGN_PATTERN_NAME', 'color-picker/input-color-design-pattern-name')
    /* 履歴 */
    .set('COLOR_PICKER__ADD_COLOR_CODE_TO_HISTORY', 'color-picker/add-color-code-to-history')
    .set('COLOR_PICKER__REMOVE_COLOR_CODE_TO_HISTORY', 'color-picker/remove-color-code-to-history')
    .set('COLOR_PICKER__ADD_PATTERN_TO_HISTORY', 'color-picker/add-pattern-to-history')
    .set('COLOR_PICKER__REMOVE_PATTERN_TO_HISTORY', 'color-picker/remove-pattern-to-history')
;

    

export default CustomEventNames;
