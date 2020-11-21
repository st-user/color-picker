(() => {

  const $canvas = document.querySelector('#imageData');
  const canvasDefaultWidth = 500;
  const canvasDefaultHeight = 500;
  $canvas.width = canvasDefaultWidth;
  $canvas.height = canvasDefaultHeight;

  const $imageFileArea = document.querySelector('#imageFileArea');
  const $imageFile = document.querySelector('#imageFile');
  const $needsToResize = document.querySelectorAll('input[name="needsToResize"]');
  const $circleBlack = document.querySelector('#circleBlack');
  const $circleWhite = document.querySelector('#circleWhite');

  const $viewColor = document.querySelector('#viewColor');

  const $rgbColorCode = document.querySelector('#rgbColorCode');
  const $rgbSilder_r = document.querySelector('#rgbSilder_r');
  const $rgbText_r = document.querySelector('#rgbText_r');
  const $rgbSilder_g = document.querySelector('#rgbSilder_g');
  const $rgbText_g = document.querySelector('#rgbText_g');
  const $rgbSilder_b = document.querySelector('#rgbSilder_b');
  const $rgbText_b = document.querySelector('#rgbText_b');

  const $hsvSilder_h = document.querySelector('#hsvSilder_h');
  const $hsvText_h = document.querySelector('#hsvText_h');
  const $hsvSilder_s = document.querySelector('#hsvSilder_s');
  const $hsvText_s = document.querySelector('#hsvText_s');
  const $hsvSilder_v = document.querySelector('#hsvSilder_v');
  const $hsvText_v = document.querySelector('#hsvText_v');

  const $sliders = [
    $rgbSilder_r, $rgbSilder_g, $rgbSilder_b,
    $hsvSilder_h, $hsvSilder_s, $hsvSilder_v,
  ];

  const toHex = d => {
    const val = Number(d).toString(16);
    if (val.length === 1) {
      return '0' + val;
    }
    return val;
  };
  const toNumber = hex => parseInt(hex, 16);


  const checkInputRange = (input, item, min, max) => {
    const reg = /^\d+$/;
    if (reg.test(input) && min <= input && input <= max) {
      return true;
    }
    alert(`${item}は${min}以上、${max}以下の整数で入力してください`);
    return false;
  };

  const checkColorCodeRgb =  value => {
    if (isNaN(value)) {
      alert('入力されたカラーコードが不正です');
      return false;
    }
    return true;
  };

  const checkColorCodeRgbAll = (r, g, b) => {
    return checkColorCodeRgb(r)
      && checkColorCodeRgb(g)
      && checkColorCodeRgb(b);
  };

  const checkRgbInputRange = input => {
    return checkInputRange(input, 'R、G、B', 0, 255);
  };

  const checkHueInputRange = input => {
    return checkInputRange(input, 'H', 0, 360);
  };

  const checkSvInputRange = input => {
    return checkInputRange(input, 'S、V', 0, 100);
  };

  const checkRgbInputRangeAll = () => {
    return checkRgbInputRange($rgbText_r.value)
    && checkRgbInputRange($rgbText_g.value)
    && checkRgbInputRange($rgbText_b.value);
  };

  const checkHsvInputRangeAll = () => {
    return checkHueInputRange($hsvText_h.value)
    && checkSvInputRange($hsvText_s.value)
    && checkSvInputRange($hsvText_v.value);
  };

  const setRgbColorToRgbSilder = (r, g, b) => {

    $rgbColorCode.value = `#${toHex(r)}${toHex(g)}${toHex(b)}`.toUpperCase();
    $viewColor.style.backgroundColor = $rgbColorCode.value;

    $rgbSilder_r.value = r;
    $rgbText_r.value = r;
    $rgbSilder_g.value = g;
    $rgbText_g.value = g;
    $rgbSilder_b.value = b;
    $rgbText_b.value = b;
  };

  const setHsvColorToHsvSilder = (h, s, v) => {
    $hsvSilder_h.value = h;
    $hsvText_h.value = h;
    $hsvSilder_s.value = s;
    $hsvText_s.value = s;
    $hsvSilder_v.value = v;
    $hsvText_v.value = v;
  };

  const setColorValuesFromRgb = (r, g, b) => {
    setRgbColorToRgbSilder(r, g, b);
    const hsv = HsvRgbConverter.rgbToHsv(r, g, b);
    setHsvColorToHsvSilder(hsv.h, hsv.s, hsv.v);
  };

  const setColorValuesFromHsv = (h, s, v) => {
    setHsvColorToHsvSilder(h, s, v);
    const rgb = HsvRgbConverter.hsvToRgb(h % 360, s / 100, v / 100);
    setRgbColorToRgbSilder(rgb.r, rgb.g, rgb.b);
  };

  const setHandlerOnRgbSilderChange = element => {
    element.addEventListener('change', () => {
      setColorValuesFromRgb(
        $rgbSilder_r.value, $rgbSilder_g.value, $rgbSilder_b.value
      );
    });
  };

  const setHandlerOnRgbTextChange = element => {
    element.addEventListener('change', () => {
      if(checkRgbInputRangeAll()) {
        setColorValuesFromRgb(
          $rgbText_r.value, $rgbText_g.value, $rgbText_b.value
        );
      } else {
        setColorValuesFromRgb(
          $rgbSilder_r.value, $rgbSilder_g.value, $rgbSilder_b.value
        );
      }
    });
  };

  const setHandlerOnColorCodeChange = element => {
    element.addEventListener('change', () => {
      const newCode = $rgbColorCode.value;
      const r = toNumber(newCode.substring(1, 3));
      const g = toNumber(newCode.substring(3, 5));
      const b = toNumber(newCode.substring(5, 7));
      if(checkColorCodeRgbAll(r, g, b)) {
        setColorValuesFromRgb(r, g, b);
      } else {
        setColorValuesFromRgb(
          $rgbSilder_r.value, $rgbSilder_g.value, $rgbSilder_b.value
        );
      }

    });
  };

  const setHandlerOnHsvSilderChange = element => {
    element.addEventListener('change', () => {
      setColorValuesFromHsv(
        $hsvSilder_h.value, $hsvSilder_s.value, $hsvSilder_v.value
      );
    });
  };

  const setHandlerOnHsvTextChange = element => {
    element.addEventListener('change', () => {
      if (checkHsvInputRangeAll()) {
        setColorValuesFromHsv(
          $hsvText_h.value, $hsvText_s.value, $hsvText_v.value
        );
      } else {
        setColorValuesFromHsv(
          $hsvSilder_h.value, $hsvSilder_s.value, $hsvSilder_v.value
        );
      }
    });
  };

  setHandlerOnRgbSilderChange($rgbSilder_r);
  setHandlerOnRgbSilderChange($rgbSilder_g);
  setHandlerOnRgbSilderChange($rgbSilder_b);

  setHandlerOnRgbTextChange($rgbText_r);
  setHandlerOnRgbTextChange($rgbText_g);
  setHandlerOnRgbTextChange($rgbText_b);

  setHandlerOnColorCodeChange($rgbColorCode);

  setHandlerOnHsvSilderChange($hsvSilder_h);
  setHandlerOnHsvSilderChange($hsvSilder_s);
  setHandlerOnHsvSilderChange($hsvSilder_v);

  setHandlerOnHsvTextChange($hsvText_h);
  setHandlerOnHsvTextChange($hsvText_s);
  setHandlerOnHsvTextChange($hsvText_v);

  setColorValuesFromRgb(255, 255, 255);


  const showCircle = (element, radius, x, y) => {
    element.style.display = 'block';
    element.style.top = `${y - radius}px`;
    element.style.left = `${x - radius}px`;
  };
  const hideCircle = element => element.style.display = 'none';

  let currentLoadedImage;
  const drawLoadedImage = () => {

    if (!currentLoadedImage) {
      return;
    }

    const needsToResize = document.querySelector('input[name="needsToResize"]:checked').value;
    const originalImageWidth = currentLoadedImage.width;
    const originalImageHeight = currentLoadedImage.height;
    let imageWidth, imageHeight;

    if (needsToResize === "0") {
      const ratioX = canvasDefaultWidth / originalImageWidth;
      const ratioY = canvasDefaultHeight / originalImageHeight;
      const resizeRatio = ratioX < ratioY ? ratioX : ratioY;

      imageWidth = originalImageWidth * resizeRatio;
      imageHeight = originalImageHeight * resizeRatio;

    } else {
      imageWidth = originalImageWidth;
      imageHeight = originalImageHeight;
    }

    $canvas.width = imageWidth;
    $canvas.height = imageHeight;

    const ctx = $canvas.getContext('2d');
    ctx.clearRect(0, 0, imageWidth, imageHeight);
    ctx.drawImage(currentLoadedImage, 0, 0, imageWidth, imageHeight);
    hideCircle($circleBlack);
    hideCircle($circleWhite);
  };

  let currentEventX, currentEventY, isControlKeyPressed, shouldPreventCircleFromMovingByArrow;
  const pickUpColorFromSelectedPx = () => {

    if (!currentEventX || !currentEventY) {
      return;
    }

    showCircle($circleBlack, 10, currentEventX, currentEventY);
    showCircle($circleWhite, 12, currentEventX, currentEventY);

    const canvasX = currentEventX - $canvas.offsetLeft;
    const canvasY = currentEventY - $canvas.offsetTop;

    const ctx = $canvas.getContext('2d');
    const imageData = ctx.getImageData(canvasX, canvasY, 1, 1);
    const rgbaData = imageData.data;

    setColorValuesFromRgb(rgbaData[0], rgbaData[1], rgbaData[2]);
  };

  $canvas.addEventListener('mousedown', event => {

    currentEventX = event.pageX;
    currentEventY = event.pageY;

    pickUpColorFromSelectedPx();
  });

  $canvas.addEventListener('mousemove', event => {

    if (!isControlKeyPressed) {
      return;
    }

    currentEventX = event.pageX;
    currentEventY = event.pageY;

    pickUpColorFromSelectedPx();

  });

  const changeCurrentEventX = diff => {
    if (!currentEventX) {
      return false;
    }
    const min = $canvas.offsetLeft;
    const max = min + $canvas.width;
    const newX = currentEventX + diff;
    if (min <= newX && newX <= max) {
      currentEventX = newX;
      return true;
    }
    return false;
  };

  const changeCurrentEventY = diff => {
    if (!currentEventY) {
      return false;
    }
    const min = $canvas.offsetTop;
    const max = min + $canvas.height;
    const newY = currentEventY + diff;
    if (min <= newY && newY <= max) {
      currentEventY = newY;
      return true;
    }
    return false;
  };

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
        if (changeCurrentEventY(1)) {
            pickUpColorFromSelectedPx();
        }
        break;
      case "Up":
      case "ArrowUp":
        if (changeCurrentEventY(-1)) {
            pickUpColorFromSelectedPx();
        }
        break;
      case "Left":
      case "ArrowLeft":
        if (changeCurrentEventX(-1)) {
            pickUpColorFromSelectedPx();
        }
        break;
      case "Right":
      case "ArrowRight":
        if (changeCurrentEventX(1)) {
            pickUpColorFromSelectedPx();
        }
        break;
      default:
        return;
    }
    event.preventDefault();
  });

  $sliders.forEach($slider => {
    $slider.addEventListener('focus', () => shouldPreventCircleFromMovingByArrow = true);
    $slider.addEventListener('blur', () => shouldPreventCircleFromMovingByArrow = false);
  })

  document.addEventListener('keyup', event => {
    if (event.key === 'Control') {
      isControlKeyPressed = false;
    }
  });

  $imageFile.addEventListener('change', e => {

    const fileData = e.target.files[0];
    const reader = new FileReader();

    reader.onerror = () => {
      alert('ファイルの読み込みに失敗しました');
    };

    reader.onload = () => {

      const loadedImage = reader.result;
      const image = new Image();
      image.src = loadedImage;

      image.onload = function() {
        currentLoadedImage = image;
        drawLoadedImage();
      };

    };
    reader.readAsDataURL(fileData);
  });

  $needsToResize.forEach(
    element => element.addEventListener("change", drawLoadedImage)
  );



})();
