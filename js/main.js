import Color from './common/Color.js';
import ColorCodeHistoryView from './history/ColorCodeHistoryView.js';
import ColorControlView from './color-control/ColorControlView.js';
import ColorDesignHistoryView from './history/ColorDesignHistoryView.js';
import ColorDesignView from './color-design/ColorDesignView.js';
import ColorListModel from './common/ColorListModel.js';
import ColorModel from './common/ColorModel.js';
import ColorPointerPinView from './tool/ColorPointerPinView.js';
import Constants from './common/Constants.js';
import ContrastRatioAutoExtractionView from './contrast-ratio/ContrastRatioAutoExtractionView.js';
import ContrastRatioCheckView from './contrast-ratio/ContrastRatioCheckView.js';
import CustomEventNames from './common/CustomEventNames.js';
import ExplanationsView from './explanations/ExplanationsView.js';
import HsvCircleCanvasView from './hsv-circle/HsvCircleCanvasView.js';
import ImageCanvasView from './image-file/ImageCanvasView.js';
import LoadedImageHolder from './image-file/LoadedImageHolder.js';
import PatternColorListModel from './common/PatternColorListModel.js';
import PatternInputModel from './common/PatternInputModel.js';
import PatternListModel from './common/PatternListModel.js';
import ToolTabsView from './tool/ToolTabsView.js';


export default function main() {

    /* Viewを跨って使用するModel群 */

    /* メインの編集領域 */
    const colorModel = new ColorModel(
        CustomEventNames.COLOR_PICKER__CHANGE_COLOR_ON_COLOR_CONTROL_VIEW,
        new Color({ colorCode: '#ffffff' })
    );
    /* 配色チェックの色リスト */
    const colorDesignCheckListOfColorModel = new PatternColorListModel(
        CustomEventNames.COLOR_PICKER__ADD_COLOR_DESIGN_TARGET_COLOR,
        CustomEventNames.COLOR_PICKER__REMOVE_COLOR_DESIGN_TARGET_COLOR
    );
    /* 配色チェックの配色名記入箇所 */
    const colorDesignCheckPatternInputModel = new PatternInputModel();
    /* 色の履歴 */
    const colorCodeHistoryColorListModel = new ColorListModel(
        CustomEventNames.COLOR_PICKER__ADD_COLOR_CODE_TO_HISTORY,
        CustomEventNames.COLOR_PICKER__REMOVE_COLOR_CODE_TO_HISTORY,
        Constants.HISTORY_MAX_SIZE
    );
    /* 配色の履歴 */
    const colorDesignHistoryPatternListModel = new PatternListModel(
        CustomEventNames.COLOR_PICKER__ADD_PATTERN_TO_HISTORY,
        CustomEventNames.COLOR_PICKER__REMOVE_PATTERN_TO_HISTORY,
        Constants.HISTORY_MAX_SIZE
    );

    /** 説明 */
    const explanationsView = new ExplanationsView();
    explanationsView.setUpEvents();

    /** RGB, HSVのスライダー */
    const colorControlView = new ColorControlView(colorModel, colorCodeHistoryColorListModel);
    colorControlView.setUpEvents();

    /** ツール */
    const toolTabsView = new ToolTabsView();
    const hsvCircleCanvasView = new HsvCircleCanvasView(colorModel);
    const imageCanvasView = new ImageCanvasView(colorModel);
    const loadedImageHolder = new LoadedImageHolder();
    const colorPointerPinView = new ColorPointerPinView();
    const contrastRatioCheckView = new ContrastRatioCheckView();
    const contrastRatioAutoExtractionView = new ContrastRatioAutoExtractionView();
    const colorDesignView = new ColorDesignView(
        colorDesignCheckListOfColorModel, colorDesignCheckPatternInputModel, colorDesignHistoryPatternListModel
    );
    toolTabsView.setUpEvent();
    hsvCircleCanvasView.setUpEvent();
    imageCanvasView.setUpEvent();
    loadedImageHolder.setUpEvent();
    colorPointerPinView.setUpEvent();
    contrastRatioCheckView.setUpEvent();
    contrastRatioAutoExtractionView.setUpEvent();
    colorDesignView.setUpEvents();

    /** 履歴 */
    const colorCodeHistoryView = new ColorCodeHistoryView(
        colorModel, colorCodeHistoryColorListModel
    );
    const colorDesignHistoryView = new ColorDesignHistoryView(
        colorDesignCheckListOfColorModel, colorDesignCheckPatternInputModel, colorDesignHistoryPatternListModel
    );
    colorCodeHistoryView.setUpEvents();
    colorDesignHistoryView.setUpEvents();

    /*
   * キーボード、マウス操作によるイメージの色取得関係のイベントハンドドラーの設定
   */
    let shouldPreventCircleFromMovingByArrow;

    const dispatchArrowKeyPressedEvent = detail => {
        const customEvent = new CustomEvent(
            CustomEventNames.COLOR_PICKER__ARROW_KEY_PRESSED,
            { detail: detail }
        );
        document.dispatchEvent(customEvent);
    };

    document.addEventListener('keydown', event => {

        if (shouldPreventCircleFromMovingByArrow) {
            return;
        }
        switch (event.key) {
        case 'Down':
        case 'ArrowDown':
            dispatchArrowKeyPressedEvent({ y: 1 });
            break;
        case 'Up':
        case 'ArrowUp':
            dispatchArrowKeyPressedEvent({ y: -1 });
            break;
        case 'Left':
        case 'ArrowLeft':
            dispatchArrowKeyPressedEvent({ x: -1 });
            break;
        case 'Right':
        case 'ArrowRight':
            dispatchArrowKeyPressedEvent({ x: 1 });
            break;
        default:
            return;
        }
        event.preventDefault();

    });

    const $controllersUsingWithArrowKey = colorControlView.getControllersUsingWithArrowKey()
        .concat(colorDesignView.getControllersUsingWithArrowKey())
        .concat(hsvCircleCanvasView.getControllersUsingWithArrowKey());
    $controllersUsingWithArrowKey.forEach($controller => {
        $controller.addEventListener('focus',
            () => shouldPreventCircleFromMovingByArrow = true
        );
        $controller.addEventListener('blur',
            () => shouldPreventCircleFromMovingByArrow = false
        );
    });

    const dispatchControlKeyPressedEvent = (event, state) => {
        if (event.key === 'Control') {
            const customEvent = new CustomEvent(
                CustomEventNames.COLOR_PICKER__CONTROL_KEY_PRESSED,
                { detail: { state: state } }
            );
            document.dispatchEvent(customEvent);
        }
    };

    document.addEventListener('keydown', event => dispatchControlKeyPressedEvent(event, true));
    document.addEventListener('keyup', event => dispatchControlKeyPressedEvent(event, false));

    const $remark = document.querySelector('#remarkAboutBrowser');
    $remark.setAttribute('style', '');

    window.isMainScriptLoadedSuccessfully = true;
}
