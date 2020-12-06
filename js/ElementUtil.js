const ElementUtil = (() => {

  return {

    getElementPosition: element => {
      let left = 0, top = 0;
      if (element.offsetParent) {
          do {
            left += element.offsetLeft;
            top += element.offsetTop;
          } while(element = element.offsetParent);

          return {
            left: left,
            top: top
          };
      }
    }
  }

})();

export default ElementUtil;
