import { RgbColorBar, HsvColorBar } from '../common/ColorBar.js';
import CustomEventNames from '../common/CustomEventNames.js';
import StateModel from '../common/StateModel.js';
import Constants from '../common/Constants.js';
import debounce from '../common/Debounce.js';

export default class ColorControlView {

    #colorModel;
    #colorCodeHistoryColorListModel;
    #stateOfAutoHistoryUpdate;
    #isInitializing;

    #$viewColor;
    #$rgbColorCode;

    #$rgbSilder_r;
    #$rgbText_r;
    #$rgbSilder_g;
    #$rgbText_g;
    #$rgbSilder_b;
    #$rgbText_b;
    #rgbColorBar;

    #$hsvSilder_h;
    #$hsvText_h;
    #$hsvSilder_s;
    #$hsvText_s;
    #$hsvSilder_v;
    #$hsvText_v;
    #hsvColorBar;

    #$storeHistoriesAutomatically;
    #$addHistory;

    constructor(colorModel, colorCodeHistoryColorListModel) {

        this.#colorModel = colorModel;
        this.#colorCodeHistoryColorListModel = colorCodeHistoryColorListModel;

        this.#stateOfAutoHistoryUpdate = new StateModel(
            CustomEventNames.COLOR_PICKER__CHANGE_STATE_OF_AUTO_HISTORY_UPDATE,
            true
        );
        this.#isInitializing = true;

        this.#$viewColor = document.querySelector('#viewColor');

        this.#$rgbColorCode = document.querySelector('#rgbColorCode');
        this.#$rgbSilder_r = document.querySelector('#rgbSilder_r');
        this.#$rgbText_r = document.querySelector('#rgbText_r');
        this.#$rgbSilder_g = document.querySelector('#rgbSilder_g');
        this.#$rgbText_g = document.querySelector('#rgbText_g');
        this.#$rgbSilder_b = document.querySelector('#rgbSilder_b');
        this.#$rgbText_b = document.querySelector('#rgbText_b');
        this.#rgbColorBar = new RgbColorBar('#rgbColorBar');

        this.#$hsvSilder_h = document.querySelector('#hsvSilder_h');
        this.#$hsvText_h = document.querySelector('#hsvText_h');
        this.#$hsvSilder_s = document.querySelector('#hsvSilder_s');
        this.#$hsvText_s = document.querySelector('#hsvText_s');
        this.#$hsvSilder_v = document.querySelector('#hsvSilder_v');
        this.#$hsvText_v = document.querySelector('#hsvText_v');
        this.#hsvColorBar = new HsvColorBar('#hsvColorBar');

        this.#$storeHistoriesAutomatically = document.querySelector('#storeHistoriesAutomatically');
        this.#$addHistory = document.querySelector('#addHistory');
    }

    setUpEvents() {

        const alertIfNecessary = error => {
            if (error) {
                alert(error);
            }
        };

        const setHandlerOnColorCodeChange = element => {
            element.addEventListener('change', () => {
                const error = this.#colorModel.setColorCode(this.#$rgbColorCode.value);
                alertIfNecessary(error);
            });
        };

        const setHandlerOnRgbSilderChange = element => {
            element.addEventListener('change', () => {
                this.#colorModel.setRgbFromString(
                    this.#$rgbSilder_r.value, this.#$rgbSilder_g.value, this.#$rgbSilder_b.value
                );
            });
        };

        const setHandlerOnRgbTextChange = element => {
            element.addEventListener('change', () => {
                const error = this.#colorModel.setRgbFromString(
                    this.#$rgbText_r.value, this.#$rgbText_g.value, this.#$rgbText_b.value
                );
                alertIfNecessary(error);
            });
        };

        const setHandlerOnHsvSilderChange = element => {
            element.addEventListener('change', () => {
                this.#colorModel.setHsvFromString(
                    this.#$hsvSilder_h.value, this.#$hsvSilder_s.value, this.#$hsvSilder_v.value
                );
            });
        };

        const setHandlerOnHsvTextChange = element => {
            element.addEventListener('change', () => {
                const error = this.#colorModel.setHsvFromString(
                    this.#$hsvText_h.value, this.#$hsvText_s.value, this.#$hsvText_v.value
                );
                alertIfNecessary(error);
            });
        };

        setHandlerOnColorCodeChange(this.#$rgbColorCode);

        setHandlerOnRgbSilderChange(this.#$rgbSilder_r);
        setHandlerOnRgbSilderChange(this.#$rgbSilder_g);
        setHandlerOnRgbSilderChange(this.#$rgbSilder_b);

        setHandlerOnRgbTextChange(this.#$rgbText_r);
        setHandlerOnRgbTextChange(this.#$rgbText_g);
        setHandlerOnRgbTextChange(this.#$rgbText_b);

        setHandlerOnHsvSilderChange(this.#$hsvSilder_h);
        setHandlerOnHsvSilderChange(this.#$hsvSilder_s);
        setHandlerOnHsvSilderChange(this.#$hsvSilder_v);

        setHandlerOnHsvTextChange(this.#$hsvText_h);
        setHandlerOnHsvTextChange(this.#$hsvText_s);
        setHandlerOnHsvTextChange(this.#$hsvText_v);

        this.#$viewColor.addEventListener('dragstart', e => {
            e.dataTransfer.effectAllowed = 'move';
            e.dataTransfer.setData('text/plain', this.#$rgbColorCode.value);
        });

        this.#$storeHistoriesAutomatically.addEventListener('change', () => {
            this.#stateOfAutoHistoryUpdate.setStateValue(this.#$storeHistoriesAutomatically.checked);
        });

        this.#$addHistory.addEventListener('click', () => {
            if (this.#stateOfAutoHistoryUpdate.getStateValue()) {
                return;
            }
            const color = this.#colorModel.getColor();
            this.#colorCodeHistoryColorListModel.addOneColorIfChanged(
                color,
                '直近の履歴と相違がないため、履歴に追加されませんでした'
            );
        });

        //size制限&removeもModelで管理しているため、追加のタイミングを間引かなければならない
        const debounceAddList = debounce(() => {
            if (!this.#stateOfAutoHistoryUpdate.getStateValue()) {
                return;
            }
            const color = this.#colorModel.getColor();
            this.#colorCodeHistoryColorListModel.addOneColorIfChanged(color);
        }, 500);

        document.addEventListener(CustomEventNames.COLOR_PICKER__CHANGE_COLOR_ON_COLOR_CONTROL_VIEW, event => {
            const color = event.detail.color;
            const preventAddHistory = event.detail.contextInfo && event.detail.contextInfo.isHistoryClickContext;
            this.#renderColor(color);
            if (!this.#isInitializing && !preventAddHistory) {
                debounceAddList();
            }
            this.#isInitializing = false;
        });

        document.addEventListener(CustomEventNames.COLOR_PICKER__CHANGE_STATE_OF_AUTO_HISTORY_UPDATE, event => {
            const stateValue = event.detail.stateValue;
            this.#renderHistoryBtn(stateValue);
        });

        this.#stateOfAutoHistoryUpdate.setStateValue(Constants.AUTO_HISTORY_UPDATE_STATE_DEFAULT);
        this.#colorModel.setRgbFromValidInteger(151, 179, 237);
    }

    getControllersUsingWithArrowKey() {
        return [
            this.#$rgbColorCode,
            this.#$rgbText_r, this.#$rgbText_g, this.#$rgbText_b,
            this.#$rgbSilder_r, this.#$rgbSilder_g, this.#$rgbSilder_b,
            this.#$hsvSilder_h, this.#$hsvSilder_s, this.#$hsvSilder_v,
            this.#$hsvText_h, this.#$hsvText_s, this.#$hsvText_v,
        ];
    }

    #renderColor(color) {
        const rgb = color.getRgb();
        const hsv = color.getHsv();

        this.#renderColorCode(color.getColorCode());
        this.#renderRgb(rgb.r, rgb.g, rgb.b);
        this.#renderHsv(hsv.h, hsv.s, hsv.v);
    }

    #renderColorCode(colorCode) {
        this.#$rgbColorCode.value = colorCode;
        this.#$viewColor.style.backgroundColor = colorCode;
    }

    #renderRgb(r, g, b) {
        this.#$rgbSilder_r.value = r;
        this.#$rgbText_r.value = r;
        this.#$rgbSilder_g.value = g;
        this.#$rgbText_g.value = g;
        this.#$rgbSilder_b.value = b;
        this.#$rgbText_b.value = b;

        this.#rgbColorBar.changePointerPosition(r);
        this.#rgbColorBar.changeGradient(g, b);
    }

    #renderHsv(h, s, v) {
        this.#$hsvSilder_h.value = h;
        this.#$hsvText_h.value = h;
        this.#$hsvSilder_s.value = s;
        this.#$hsvText_s.value = s;
        this.#$hsvSilder_v.value = v;
        this.#$hsvText_v.value = v;

        this.#hsvColorBar.changePointerPosition(h);
        this.#hsvColorBar.changeGradient(s, v);
    }

    #renderHistoryBtn(checked) {
        this.#$addHistory.disabled = checked;
    }
}
