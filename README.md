# sn-insurance

個人的な習作としてPocketBaseのサンプルで作った、端末の保険状態を確認するツール。 目的の端末のSerial Numberを入力して、検索をかけるだけ

Docker Composeを使う場合は[cloudflared](https://github.com/cloudflare/cloudflared)を同梱しているので、[Cloudflare Tunnel](https://developers.cloudflare.com/cloudflare-one/connections/connect-networks/)を設定する


PocketBaseではAuth CollectionでGoogleをIdPに設定しているので[Google Cloud Platform](https://console.cloud.google.com/)のConsoleからアプリを作る

----

GitHub Copilotの利用も兼ねた実験なので.githubもignoreしてない

## release
ビルドして実行する場合

```sh
task build
./sn-insurance serve --http localhost:9991
```


Docker Composeを使う場合
```sh
docker compose build --no-cache
docker compose up -d
```

## insert data
データの投入は`bulk-insert-sn`コマンドを使う

```sh
./sn-insurance bulk-insert-sn serialnumbers.csv
```

Docker Composeを使う場合
```sh
docker cp ./serialnumbers.csv sn-insurance:/app/sn.csv
docker exec -it sn-insurance ./sn-insurance bulk-insert-sn /app/sn.csv
```