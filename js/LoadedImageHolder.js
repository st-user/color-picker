import Constants from "./Constants.js";

export default class LoadedImageHolder {

  #$imageFile;
  #currentLoadedImage;

  constructor() {
    const $imageFile = document.querySelector('#imageFile');
    this.#$imageFile = $imageFile;
  }

  init(onload) {
    const currentLoadedImage = this.#currentLoadedImage;

    this.#$imageFile.addEventListener('change', e => {

      const fileData = e.target.files[0];
      const reader = new FileReader();

      reader.onerror = () => {
        alert('ファイルの読み込みに失敗しました');
      };

      reader.onload = () => {

        const loadedImage = reader.result;
        const image = new Image();
        image.src = loadedImage;

        image.onload = () => {
          this.#currentLoadedImage = image;
          this.consumeCurrentImageInfo(onload);
        };

      };
      reader.readAsDataURL(fileData);
    });
  }

  consumeCurrentImageInfo(consumer) {
    const wh = this.#calcWidthAndHeight();
    consumer(this.#currentLoadedImage, wh.width, wh.height);
  }


  #calcWidthAndHeight() {
    const currentLoadedImage = this.#currentLoadedImage;

    if (!currentLoadedImage) {
      return {
        width: Constants.CANVAS_DEFAULT_WIDTH,
        height: Constants.CANVAS_DEFAULT_HEIGHT
      };
    }

    const needsToResize = document.querySelector('input[name="needsToResize"]:checked').value;
    const originalImageWidth = currentLoadedImage.width;
    const originalImageHeight = currentLoadedImage.height;
    let imageWidth, imageHeight;

    if (needsToResize === "0") {
      const ratioX = Constants.CANVAS_DEFAULT_WIDTH / originalImageWidth;
      const ratioY = Constants.CANVAS_DEFAULT_HEIGHT / originalImageHeight;
      const resizeRatio = ratioX < ratioY ? ratioX : ratioY;

      imageWidth = originalImageWidth * resizeRatio;
      imageHeight = originalImageHeight * resizeRatio;

    } else {
      imageWidth = originalImageWidth;
      imageHeight = originalImageHeight;
    }

    return {
      width: imageWidth,
      height: imageHeight
    };
  }
}
