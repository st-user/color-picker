# color-picker
RGB/HSVをスライダーバーで調整してカラーコードを作成するためのツールです。画像から色を抽出したり、編集したカラーコードを保存できます。

サイト→https://www.ajizablg.com/color-picker/index.html

## ビルド方法
### 前提
- [Node.js](https://nodejs.org/ja/)をインストールしてください

### 手順
別リポジトリ[vncho-lib](https://github.com/st-user/vncho-lib)の共通ライブラリに依存しているので、その共通ライブラリを先にクローンしてから、ビルドします。

```
git clone https://github.com/st-user/vncho-lib.git
cd vncho-lib
npm install
npm run build-css
cd ../

git clone https://github.com/st-user/color-picker.git
cd color-picker
npm install
npm run clean
npm run build-css
npm run start
```

gitをインストールしていない場合、zipをダウンロードし、同様に上記コマンドを実行してください。

以上により、`http://localhost:8080/color-picker/index.html`にアクセスできるようになります。
プロダクション版（ウェブサーバーのドキュメントルートなどに配置する版）をビルドする場合は
```
npm run clean
npm run build
npm run license-gen
```
を実行してください。


### 参考サイト
###### RGB,HSVの相互変換
- https://www.rapidtables.com/convert/color/hsv-to-rgb.html
- https://www.rapidtables.com/convert/color/rgb-to-hsv.html

###### HSV to HSLの変換
- https://stackoverflow.com/questions/3423214/convert-hsb-hsv-color-to-hsl


### ライセンス
ソースコードのライセンスは[LICENSE](https://github.com/st-user/color-picker/blob/master/LICENSE)記載の通りMITですが、[assets](https://github.com/st-user/color-picker/tree/master/assets)に配置するicon,logoについては、許可なく利用することを禁止します。
