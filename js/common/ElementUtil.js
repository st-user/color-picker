const ElementUtil = (() => {

    return {

        getElementPosition: element => {
            let left = 0, top = 0;
            if (element.offsetParent) {
                do {
                    left += element.offsetLeft;
                    top += element.offsetTop;
                    element = element.offsetParent;
                } while(element);

                return {
                    left: left,
                    top: top
                };
            }
        }
    };

})();

export default ElementUtil;
