# =============================================================================
# Builder Stage
# =============================================================================
FROM alpine:3.22.1 AS builder

WORKDIR /app

# 必要なツールをインストール
RUN apk add --no-cache \
    go \
    curl \
    bash \
    git \
    ca-certificates

# go path
ENV PATH="/root/go/bin:${PATH}"

# bun path
ENV PATH="/root/.bun/bin:${PATH}"
RUN curl -fsSL https://bun.com/install | bash

# Taskfileのインストール
RUN go install github.com/go-task/task/v3/cmd/task@latest

# Go依存関係のダウンロード（キャッシュ効率化）
COPY go.mod go.sum ./
RUN go mod download

# ソースコードをコピー
COPY . .

# フロントエンドとバックエンドをビルド
RUN task build


# =============================================================================
# Runtime Stage
# =============================================================================
FROM alpine:3.22.1 AS runtime-alpine

WORKDIR /app

# copy build product
COPY --from=builder /app/sn-insurance /app/
COPY --from=builder /app/pb_data /app/pb_data
# 環境変数必要だった（イケてないが今回のやつはsecretにいれたりするほどのものでもない）
COPY --from=builder /app/.env /app/.env
COPY --from=builder /app/config.yaml /app/config.yaml

EXPOSE 8090

CMD ["./sn-insurance", "serve", "--http=0.0.0.0:8090"]

