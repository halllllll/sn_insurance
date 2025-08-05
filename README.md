# sn-insurance

PocketBaseのサンプルで作った、端末の保険状態を確認するツール。 目的の端末のSerial Numberを入力して、検索をかけるだけ

----

GitHub Copilotの利用も兼ねた実験なので.githubもignoreしてない

## release
フロントエンドコードをembedしたgoのバイナリファイルを適当なサーバーに置くのを想定

```sh
task build
./sn-insurance serve --http localhost:9999
```