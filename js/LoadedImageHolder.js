import Constants from './Constants.js';
import CustomEventNames from './CustomEventNames.js';

export default class LoadedImageHolder {

  #$imageFile;
  #currentLoadedImage;

  #$needsToResize;

  constructor() {
      this.#$imageFile = document.querySelector('#imageFile');
      this.#$needsToResize = document.querySelectorAll('input[name="needsToResize"]');
  }

  setUpEvent() {

      this.#$needsToResize.forEach(
          element => element.addEventListener('change',
              () => this.#dispatchImageLoadedEvent()
          )
      );

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
                  this.#dispatchImageLoadedEvent();
              };

          };
          reader.readAsDataURL(fileData);
      });
  }

  #dispatchImageLoadedEvent() {
      const wh = this.#calcWidthAndHeight();
      const customEvent = new CustomEvent(
          CustomEventNames.COLOR_PICKER__IMAGE_FILE_LOADED,
          {
              detail: {
                  image: this.#currentLoadedImage,
                  width: wh.width,
                  height: wh.height
              }
          }
      );
      document.dispatchEvent(customEvent);
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

      if (needsToResize === '0') {
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
