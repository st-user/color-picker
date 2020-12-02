# color-picker
RGB/HSVをスライダーバーで調整してカラーコードを作成するためのツールです。画像から色を抽出したり、編集したカラーコードを保存できます。

サイト→https://tools.ajizablg.com/color-picker/index.html

## ビルド方法
### 前提
- [Node.js](https://nodejs.org/ja/)をインストールしてください

### 手順
```
git clone https://github.com/st-user/color-picker.git
cd color-picker
npm install
npm run build
```

gitをインストールしていない場合、zipをダウンロードし、同様に上記コマンドを実行してください。

以上により、`color-picker/dist/color-picker/index.html`にブラウザからアクセスできるようになります。

### 参考サイト
###### RGB,HSVの相互変換
- https://www.rapidtables.com/convert/color/hsv-to-rgb.html
- https://www.rapidtables.com/convert/color/rgb-to-hsv.html

###### HSV to HSLの変換
- https://stackoverflow.com/questions/3423214/convert-hsb-hsv-color-to-hsl
