# TweetSearchFromWeb

nightmare.jsとかでTwitterの検索とファイル保存するやつ

## 動作確認環境
- macOS Sierra
- Node v10.3.0
- npm 6.1.0

ほかは試してません。

## 準備
```
$ git clone https://github.com/Nagatani/TweetSearchFromWeb.git
$ cd TweetSearchFromWeb
$ npm install
```

## 実行方法

```
$ node index.js 検索キーワード 2018-01-01_00:00:00_JST 2018-01-01_23:59:59_JST
```

引数でキーワード、検索開始日時、終了日時を設定して起動します。
日時はちゃんとJSTまで設定しないと時刻がずれる気がします。

## LICENSE
WTPFL
