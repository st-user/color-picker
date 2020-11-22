const COLOR_PICKER_NS = "color-picker/"

const StorageAccessor = (() => {

  return {

    getObject: key => {

      try {

        const itemStr = localStorage.getItem(COLOR_PICKER_NS + key);
        if (!itemStr) {
          return undefined;
        }
        return JSON.parse(itemStr);

      } catch(e) {
        console.error(e);
      }

    },

    setObject: (key, obj) => {

      try {

        localStorage.setItem(COLOR_PICKER_NS + key, JSON.stringify(obj));

      } catch(e) {
        console.error(e);
      }

    },

    removeItem: key => {

      try {

        localStorage.removeItem(COLOR_PICKER_NS + key);

      } catch(e) {
        console.error(e);
      }
    }

  }

})();

export default StorageAccessor;
