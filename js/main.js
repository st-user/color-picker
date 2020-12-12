import ExplanationsView from './explanations/ExplanationsView.js';
import ToolTabsView from './tool/ToolTabsView.js';
import HsvCircleCanvasView from './hsv-circle/HsvCircleCanvasView.js';
import ImageCanvasView from './image-file/ImageCanvasView.js';
import ColorPointerPinView from './tool/ColorPointerPinView.js';
import LoadedImageHolder from './image-file/LoadedImageHolder.js';
import ColorControlView from './color-control/ColorControlView.js';
import ColorCodeHistoryView from './history/ColorCodeHistoryView.js';
import ColorDesignView from './color-design/ColorDesignView.js';
import ContrastRatioCheckView from './contrast-ratio/ContrastRatioCheckView.js';
import ContrastRatioAutoExtractionView from './contrast-ratio/ContrastRatioAutoExtractionView.js';
import ColorDesignHistoryView from './history/ColorDesignHistoryView.js';
import CustomEventNames from './common/CustomEventNames.js';



export default function main() {

    const explanationsView = new ExplanationsView();
    const colorControlView = new ColorControlView();
    const toolTabsView = new ToolTabsView();
    const hsvCircleCanvasView = new HsvCircleCanvasView();
    const imageCanvasView = new ImageCanvasView();
    const colorPointerPinView = new ColorPointerPinView();
    const loadedImageHolder = new LoadedImageHolder();
    const contrastRatioCheckView = new ContrastRatioCheckView();
    const contrastRatioAutoExtractionView = new ContrastRatioAutoExtractionView();
    const colorDesignView = new ColorDesignView();
    const colorCodeHistoryView = new ColorCodeHistoryView();
    const colorDesignHistoryView = new ColorDesignHistoryView();

    explanationsView.setUpEvents();

    /*
   * RGB, HSVのスライダー関係のイベントハンドラーの設定
   */
    colorControlView.setUpEvents(
        colorCode => colorCodeHistoryView.addColorCode(colorCode, true),
        colorCode => colorCodeHistoryView.addColorIfAutomatic(colorCode)
    );
    colorCodeHistoryView.setUpEvents();

    colorCodeHistoryView.onChangeAutomationState(isAutomatic => {
        colorControlView.changeAddHistoryControlState(isAutomatic);
    });
    colorCodeHistoryView.onClickHistory(colorCode => {
        colorControlView.setColorValuesFromValidColorCode(colorCode);
    });
    colorControlView.changeAddHistoryControlState(true);

    /*
   * 画像ファイル関係のイベントハンドラーの設定
   */
    toolTabsView.setUpEvent();
    hsvCircleCanvasView.setUpEvent();
    imageCanvasView.setUpEvent();
    contrastRatioCheckView.setUpEvent();
    contrastRatioAutoExtractionView.setUpEvent();
    loadedImageHolder.setUpEvent();
    colorPointerPinView.setUpEvent();


    /*
   * 配色チェック関係のイベントハンドラーの設定
   */
    colorDesignView.setUpEvents(data => {
        colorDesignHistoryView.addHistoryThenShowColorDesignTab(data);
    });
    colorDesignHistoryView.setUpEvents();
    colorDesignHistoryView.onClickHistory(patternInfo => {
        colorDesignView.setColorInfoFromPatternInfoIfConfirmed(patternInfo);
    });

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
