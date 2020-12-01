import Explanations from "./Explanations.js";
import CanvasHandler from "./CanvasHandler.js";
import ColorPointerCircles from "./ColorPointerCircles.js";
import LoadedImageHolder from "./LoadedImageHolder.js";
import CurrentEventXY from "./CurrentEventXY.js";
import ChangeColorController from "./ChangeColorController.js";
import ColorCodeHistories from "./ColorCodeHistories.js";
import ColorDesignCheck from "./ColorDesignCheck.js";
import ColorDesignHistories from "./ColorDesignHistories.js";
import debounce from "./Debounce.js";



export default function main() {

  const explanations = new Explanations();
  const changeColorController = new ChangeColorController();
  const canvasHandler = new CanvasHandler();
  const colorPointerCircles = new ColorPointerCircles();
  const currentEventXY = new CurrentEventXY(canvasHandler);
  const loadedImageHolder = new LoadedImageHolder();
  const colorDesignCheck = new ColorDesignCheck();
  const colorCodeHistories = new ColorCodeHistories();
  const colorDesignHistories = new ColorDesignHistories();

  const $needsToResize = document.querySelectorAll('input[name="needsToResize"]');

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
  const drawCurrentLoadedImage = (currentLoadedImage, imageWidth, imageHeight) => {

    canvasHandler.drawImageWithSpecificSize(
      currentLoadedImage, imageWidth, imageHeight
    );
    colorPointerCircles.hide();

  };

  loadedImageHolder.init(drawCurrentLoadedImage);

  $needsToResize.forEach(
    element => element.addEventListener("change",
      () => loadedImageHolder.consumeCurrentImageInfo(drawCurrentLoadedImage)
    )
  );


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
  let isControlKeyPressed, shouldPreventCircleFromMovingByArrow;
  const pickUpColorFromSelectedPx = () => {

    if (currentEventXY.exists()) {
      colorPointerCircles.show(currentEventXY.x(), currentEventXY.y());
      const rgbaData = canvasHandler.extractRgb(currentEventXY.x(), currentEventXY.y());
      changeColorController.setColorValuesFromRgb(rgbaData[0], rgbaData[1], rgbaData[2]);
    }

  };

  canvasHandler.onMousedown(event => {

    currentEventXY.set({
      x: event.pageX,
      y: event.pageY
    });
    pickUpColorFromSelectedPx();

  });

  canvasHandler.onMousemove(event => {

    if (!isControlKeyPressed) {
      return;
    }
    currentEventXY.set({
      x: event.pageX,
      y: event.pageY
    });
    pickUpColorFromSelectedPx();

  });

  document.addEventListener('keydown', event => {

    if (event.key === 'Control') {
      isControlKeyPressed = true;
    }

  });

  document.addEventListener('keydown', event => {

    if (shouldPreventCircleFromMovingByArrow) {
      return;
    }
    switch (event.key) {
      case "Down":
      case "ArrowDown":
        if (currentEventXY.changeCurrentEventY(1)) {
            pickUpColorFromSelectedPx();
        }
        break;
      case "Up":
      case "ArrowUp":
        if (currentEventXY.changeCurrentEventY(-1)) {
            pickUpColorFromSelectedPx();
        }
        break;
      case "Left":
      case "ArrowLeft":
        if (currentEventXY.changeCurrentEventX(-1)) {
            pickUpColorFromSelectedPx();
        }
        break;
      case "Right":
      case "ArrowRight":
        if (currentEventXY.changeCurrentEventX(1)) {
            pickUpColorFromSelectedPx();
        }
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

  document.addEventListener('keyup', event => {
    if (event.key === 'Control') {
      isControlKeyPressed = false;
    }
  });

  window.addEventListener('resize', debounce(event => {
    colorPointerCircles.hide();
  }, 500));


  const $remark = document.querySelector('#remarkAboutBrowser');
  $remark.setAttribute('style', '');

  window.isMainScriptLoadedSuccessfully = true;
};
