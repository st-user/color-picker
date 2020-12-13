const CustomEventNames = {
    /* 色編集領域 */
    COLOR_PICKER__CHANGE_COLOR_ON_COLOR_CONTROL_VIEW: 'color-picker/change-color-on-color-control-view',
    COLOR_PICKER__UPDATE_COLOR_CODE_HISTORY: 'color-picker/update-color-code-history',
    COLOR_PICKER__CHANGE_STATE_OF_AUTO_HISTORY_UPDATE: 'color-picker/change-state-of-auto-history-update',
    /* ツール 画像/HSV chart */
    COLOR_PICKER__IMAGE_DATA_POINTED: 'color-picker/image-data-pointed',
    COLOR_PICKER__ARROW_KEY_PRESSED: 'color-picker/arrow-key-pressed',
    COLOR_PICKER__CONTROL_KEY_PRESSED: 'color-picker/control-key-pressed',
    COLOR_PICKER__IMAGE_FILE_LOADED: 'color-picker/image-file-loaded',
    COLOR_PICKER__HIDE_COLOR_POINTER_PIN: 'color-picker/color-pointer-pin-hide',
    /* コントラスト比 */
    COLOR_PICKER__CHANGE_CONTRAST_RATIO_CHECK_COLOR: 'color-picker/change-contrast-ratio-check-color',
    COLOR_PICKER__ADD_CONTRAST_RATIO_AUTO_EXTRACTION_TARGET_COLOR: 'color-picker/add-contrast-ratio-auto-extraction-target-color',
    COLOR_PICKER__REMOVE_CONTRAST_RATIO_AUTO_EXTRACTION_TARGET_COLOR: 'color-picker/remove-contrast-ratio-auto-extraction-target-color',
    /* 配色チェック */
    COLOR_PICKER__ADD_COLOR_DESIGN_TARGET_COLOR: 'color-picker/add-color-design-target-color',
    COLOR_PICKER__REMOVE_COLOR_DESIGN_TARGET_COLOR: 'color-picker/remove-color-design-target-color',
    COLOR_PICKER__INPUT_COLOR_DESIGN_PATTERN_NAME: 'color-picker/input-color-design-pattern-name',
    /* 履歴 */
    COLOR_PICKER__ADD_PATTERN_TO_HISTORY: 'color-picker/add-pattern-to-history',
    COLOR_PICKER__REMOVE_PATTERN_TO_HISTORY: 'color-picker/remove-pattern-to-history'
};

const checkDuplication = () => {
    const checkMap = {};
    Object.values(CustomEventNames).forEach(name => {
        const existingValue = checkMap[name];
        if (existingValue) {
            throw `CustomEventNamesの値が重複しています : ${existingValue}`;
        }
        checkMap[name] = name;
    });
};
checkDuplication();

export default CustomEventNames;
