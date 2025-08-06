FROM alpine:3.22.1

WORKDIR /app

# go path
ENV PATH="/root/go/bin:${PATH}"
# bun path

ENV PATH="/root/.bun/bin:${PATH}"
# go env
# https://zenn.dev/ras96/articles/31873f1e195650
RUN apk --update add --no-cache go unzip curl bash

# go build
COPY go.mod go.sum ./
RUN go mod download -x

# bun env
RUN curl -fsSL https://bun.com/install | bash

COPY . .

# taskfile
RUN go install github.com/go-task/task/v3/cmd/task@latest

RUN task build

CMD [ "task", "up"]