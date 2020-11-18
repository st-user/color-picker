(() => {

  const $canvas = document.querySelector('#imageData');

  const $imageFileArea = document.querySelector('#imageFileArea');
  const $imageFile = document.querySelector('#imageFile');
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

  $canvas.addEventListener('mousedown', event => {

    const eventX = event.x;
    const eventY = event.y;

    showCircle($circleBlack, 10, eventX, eventY);
    showCircle($circleWhite, 12, eventX, eventY);

    const canvasX = eventX - $canvas.offsetLeft;
    const canvasY = eventY - $canvas.offsetTop;

    console.log(`x: ${canvasX} y:${canvasY}`);

    const ctx = $canvas.getContext('2d');
    const imageData = ctx.getImageData(canvasX, canvasY, 1, 1);
    const rgbaData = imageData.data;

    setColorValuesFromRgb(rgbaData[0], rgbaData[1], rgbaData[2]);
  });

  $imageFile.addEventListener('change', e => {

    hideCircle($circleBlack);
    hideCircle($circleWhite);

    const fileData = e.target.files[0];
    const imageType = fileData.type;
    console.log(imageType);

    const reader = new FileReader();
    reader.onloadstart = () => {
      console.log('load start');
    }
    reader.onerror = () => {
      alert('error');
    };

    reader.onload = () => {

      const loadedImage = reader.result;
      const ctx = $canvas.getContext('2d');
      const canvasHeight = $canvas.height;
      const canvasWidth = $canvas.width;

      ctx.clearRect(0, 0, canvasHeight, canvasWidth);
      const image = new Image();
      image.src = loadedImage;

      image.onload = () => {

        const imageHeight = this.height < canvasHeight ? this.height : canvasHeight;
        const imageWidth = this.width < canvasWidth ? this.width : canvasWidth;

        ctx.drawImage(image, 0, 0, imageWidth, imageHeight);
      };

    };
    reader.readAsDataURL(fileData);
  });


})();
