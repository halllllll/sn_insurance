# Project Overview
PocketBaseをGoのフレームワークとして利用したアプリのサンプル。
- GoogleのIdPによるOAuth
  - ユーザー情報は不要で、Googleでログインしたいだけ
- ログインしたユーザーは、DBの`serial_numbers`のデータを検索できる。

## Folder Structure

- `frontend/*`にはフロントエンドコードがある
- `frontend/src/main.tsx`がエントリポイント
- `main.go`がバックエンドのエントリポイント

## Libaries and Frameworks
- React / TypeScript。開発サーバーとビルダーにはviteを利用
- PocketBaseをGoのフレームワークとして利用

## UI guidelines
フロントエンドでは`daisyUI`を使用する。

## DB Schema
PocketBaseデフォルトのAuthコレクションである`users`コレクションと、Baseコレクションである`serial_numbers`がある。


