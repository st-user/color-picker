const COLOR_PICKER_NS = "color-picker/"

const ERROR_MESSAGE = 'ローカルストレージへのアクセス中にエラーが発生しました。ブラウザの設定でローカルストレージが無効となっている可能性があります。';

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
        alert(ERROR_MESSAGE);
      }

    },

    setObject: (key, obj) => {

      try {

        localStorage.setItem(COLOR_PICKER_NS + key, JSON.stringify(obj));

      } catch(e) {
        console.error(e);
        alert(ERROR_MESSAGE);
      }

    },

    removeItem: key => {

      try {

        localStorage.removeItem(COLOR_PICKER_NS + key);

      } catch(e) {
        console.error(e);
        alert(ERROR_MESSAGE);
      }
    }

  }

})();

export default StorageAccessor;
