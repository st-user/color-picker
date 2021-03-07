import { hideColorPointerPinView } from '../common/CustomEventDispatcher.js';

export default class ToolTabsView {


    setUpEvent() {

        const $toolTabItems = document.querySelectorAll('input[name="toolTabItem"]');
        $toolTabItems.forEach($item => {
            $item.addEventListener('change', () => {
                hideColorPointerPinView();
            });
        });

        $toolTabItems[0].checked = true;
    }
}
