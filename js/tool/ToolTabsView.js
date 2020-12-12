import CommonEventDispatcher from '../common/CommonEventDispatcher.js';

export default class ToolTabsView {


    setUpEvent() {

        const $toolTabItems = document.querySelectorAll('input[name="toolTabItem"]');
        $toolTabItems.forEach($item => {
            $item.addEventListener('change', () => {
                CommonEventDispatcher.hideColorPointerPinView();
            });
        });

    }
}
