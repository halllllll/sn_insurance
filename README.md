# sn insurance check
PocketBaseのサンプルで作った、端末の保険状態を確認するツール。
目的の端末のSerial Numberを入力して、検索をかけるだけ

----

GitHub Copilotの利用も兼ねた実験なので`.github`もignoreしてない


# schema
PocketBaseデフォルトのUserコレクション（Auth）と、ふつうのSerialNumbersコレクション（Base）が存在する。relationはない。以上。

```mermaid
---
title: ""
---
erDiagram

    users {
        text id "Nonempty"
        text password "Nonempty, Hidden"
        text tokenKey "Nonempty, Hidden"
        email email "Nonempty"
        bool emailVisibility
        bool verified
        varchar name
        text avatar
        timestamp created_at "OnCreated"
        timestamp updated_at "OnUpdated"
    }

    serial_numbers {
        text id "Nonempty"
        text serial_number "Nonempty"
        bool is_insurance "Nonempty"
        timestamp created_at "OnCreated"
        timestamp updated_at "OnUpdated"
    }
```
# release
フロントエンドコードをembedしたgoのバイナリファイルを適当なサーバーに置くのを想定

```sh
go run main serve --http localhost:8090
```