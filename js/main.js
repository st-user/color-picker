import Explanations from './Explanations.js';
import ToolTabs from './ToolTabs.js';
import HsvCircleCanvasHandler from './HsvCircleCanvasHandler.js';
import ImageCanvasHandler from './ImageCanvasHandler.js';
import ColorPointerPin from './ColorPointerPin.js';
import LoadedImageHolder from './LoadedImageHolder.js';
import CurrentEventXY from './CurrentEventXY.js';
import ChangeColorController from './ChangeColorController.js';
import ColorCodeHistories from './ColorCodeHistories.js';
import ColorDesignCheck from './ColorDesignCheck.js';
import ColorDesignHistories from './ColorDesignHistories.js';
import CustomEventNames from './CustomEventNames.js';
import debounce from './Debounce.js';



export default function main() {

  const explanations = new Explanations();
  const changeColorController = new ChangeColorController();
  const toolTabs = new ToolTabs();
  const hsvCircleCanvasHandler = new HsvCircleCanvasHandler();
  const imageCanvasHandler = new ImageCanvasHandler();
  const colorPointerPin = new ColorPointerPin();
  const loadedImageHolder = new LoadedImageHolder();
  const colorDesignCheck = new ColorDesignCheck();
  const colorCodeHistories = new ColorCodeHistories();
  const colorDesignHistories = new ColorDesignHistories();

  explanations.setUpEvents();

  /*
   * RGB, HSVのスライダー関係のイベントハンドラーの設定
   */
  changeColorController.setUpEvents(
    colorCode => colorCodeHistories.addColorCode(colorCode, true),
    colorCode => colorCodeHistories.addColorIfAutomatic(colorCode)
  );
  colorCodeHistories.setUpEvents();

  colorCodeHistories.onChangeAutomationState(isAutomatic => {
    changeColorController.changeAddHistoryControlState(isAutomatic);
  });
  colorCodeHistories.onClickHistory(colorCode => {
    changeColorController.setColorValuesFromValidColorCode(colorCode);
  });
  changeColorController.changeAddHistoryControlState(true);

  /*
   * 画像ファイル関係のイベントハンドラーの設定
   */
  toolTabs.setUpEvent();
  hsvCircleCanvasHandler.setUpEvent();
  imageCanvasHandler.setUpEvent();
  loadedImageHolder.setUpEvent();
  colorPointerPin.setUpEvent();


  /*
   * 配色チェック関係のイベントハンドラーの設定
   */
  colorDesignCheck.setUpEvents(data => {
    colorDesignHistories.addHistoryThenShowColorDesignTab(data);
  });
  colorDesignHistories.setUpEvents();
  colorDesignHistories.onClickHistory(patternInfo => {
    colorDesignCheck.setColorInfoFromPatternInfoIfConfirmed(patternInfo);
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
      case "Down":
      case "ArrowDown":
        dispatchArrowKeyPressedEvent({ y: 1 });
        break;
      case "Up":
      case "ArrowUp":
        dispatchArrowKeyPressedEvent({ y: -1 });
        break;
      case "Left":
      case "ArrowLeft":
        dispatchArrowKeyPressedEvent({ x: -1 });
        break;
      case "Right":
      case "ArrowRight":
        dispatchArrowKeyPressedEvent({ x: 1 });
        break;
      default:
        return;
    }
    event.preventDefault();

  });

  const $controllersUsingWithArrowKey = changeColorController.getControllersUsingWithArrowKey()
                                          .concat(colorDesignCheck.getControllersUsingWithArrowKey());
  $controllersUsingWithArrowKey.forEach($controller => {
    $controller.addEventListener('focus',
      () => shouldPreventCircleFromMovingByArrow = true
    );
    $controller.addEventListener('blur',
      () => shouldPreventCircleFromMovingByArrow = false
    );
  })

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
};
