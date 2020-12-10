import CommonEventDispatcher from './CommonEventDispatcher.js';

export default class ToolTabs {


    setUpEvent() {

        const $toolTabItems = document.querySelectorAll('input[name="toolTabItem"]');
        $toolTabItems.forEach($item => {
            $item.addEventListener('change', event => {
                CommonEventDispatcher.hideColorPointerPin();
            });
        });

    }
}
