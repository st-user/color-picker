import { CommonEventDispatcher, HeaderView, ExplanationsView } from 'vncho-lib';

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
import ContrastRatioCheckModel from './contrast-ratio/ContrastRatioCheckModel.js';
import ContrastRatioCheckView from './contrast-ratio/ContrastRatioCheckView.js';
import CustomEventNames from './common/CustomEventNames.js';
import HsvCircleCanvasView from './hsv-circle/HsvCircleCanvasView.js';
import ImageCanvasView from './image-file/ImageCanvasView.js';
import LoadedImageHolder from './image-file/LoadedImageHolder.js';
import PatternColorListModel from './common/PatternColorListModel.js';
import PatternInputModel from './common/PatternInputModel.js';
import PatternListModel from './common/PatternListModel.js';
import ToolTabsView from './tool/ToolTabsView.js';

const headerConfig  = {
    containerSelector: '#headerArea',
    title: 'カラーコード作成ツール',
    remarkAboutBrowser: `ブラウザは、Google Chrome, Firefox, Microsoft Edge(Chromium版), Safariの、できるだけ最新に近いバージョンを使用してください。
    これら意外のブラウザでは動作しない可能性があります。`
};

const expanationsConfig = {
    eventName: CustomEventNames.COLOR_PICKER__TOGGLE_EXPLANATIONS
};


export default function main() {

    /* Viewを跨って使用するModel群 */

    /* メインの編集領域 */
    const colorModel = new ColorModel(
        CustomEventNames.COLOR_PICKER__CHANGE_COLOR_ON_COLOR_CONTROL_VIEW,
        new Color({ colorCode: '#ffffff' })
    );
    /* コントラスト比の確認 */
    const contrastRatioCheckModel = new ContrastRatioCheckModel();
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

    /** Header */
    new HeaderView(headerConfig);

    /** 説明 */
    const explanationsView = new ExplanationsView(expanationsConfig);
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
    const contrastRatioCheckView = new ContrastRatioCheckView(
        colorModel, contrastRatioCheckModel
    );
    const contrastRatioAutoExtractionView = new ContrastRatioAutoExtractionView(
        contrastRatioCheckModel
    );
    const colorDesignView = new ColorDesignView(
        colorModel, colorDesignCheckListOfColorModel, colorDesignCheckPatternInputModel, colorDesignHistoryPatternListModel
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
        CommonEventDispatcher.dispatch(CustomEventNames.COLOR_PICKER__ARROW_KEY_PRESSED, detail);
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
        CommonEventDispatcher.dispatch(CustomEventNames.COLOR_PICKER__ENABLE_TO_PICK_UP_COLOR_ON_MOUSE_MOVE,
            { state: state }
        );
    };

    document.addEventListener('mousedown', event => dispatchControlKeyPressedEvent(event, true));
    document.addEventListener('mouseup', event => dispatchControlKeyPressedEvent(event, false));
}
