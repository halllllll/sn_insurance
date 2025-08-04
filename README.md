# 端末保険状況確認システム

⚠️ **重要: 現在このアプリケーションには動作しない機能があります** ⚠️

詳細は `docs/current_issues_and_requirements.md` および `docs/session_history.md` を参照してください。

PocketBaseを使った端末のシリアル番号から保険状況を確認するWebアプリケーションです。

## 概要

貸出端末の保険の有無を素早く確認することを目的としたツールです。シリアル番号を入力することで、その端末が保険に加入しているかどうかを瞬時に確認できます。

## 現在の状況（2025年8月3日）

### ✅ 動作する機能
- GoogleOAuth認証
- 基本的なUIレイアウト
- PocketBaseとの接続

### ❌ 動作しない可能性のある機能
- シリアル番号検索（単体・複数）
- CSV読み込み・一括検索
- リアルタイム検索
- 結果の可視化・統計表示
- CSV出力機能

### 📋 対象機能（本来実装されるべき）

- **シリアル番号検索**: 単体または複数のシリアル番号を一度に検索
- **CSV一括検索**: CSVファイルから複数のシリアル番号を読み込んで一括検索
- **リアルタイム検索**: 入力に応じて候補をリアルタイム表示
- **結果の可視化**: 保険状況を色分けして分かりやすく表示
- **CSV出力**: 検索結果をCSVファイルとしてダウンロード
- **統計表示**: 検索結果の統計情報
- **モバイル対応**: スマートフォンでの使用を考慮したレスポンシブデザイン
- **使い方ガイド**: アプリ内にヘルプ機能を内蔵

## 🚨 次のLLMセッションへの引き継ぎ

### 必読ドキュメント
1. `docs/current_issues_and_requirements.md` - 現在の問題と要求仕様
2. `docs/session_history.md` - 作業履歴とセッション記録
3. `docs/quick_start_next_session.md` - 次回作業のクイックスタート
4. `docs/code_quality_report.md` - ファイル状態とコード品質

### 最優先タスク
1. 現在のアプリケーションの動作確認
2. 検索機能の修復（段階的アプローチ推奨）
3. 不要な複雑化されたファイルの整理

### 重要な注意事項
- **「動くコードが第一」** を最優先
- 複雑な設計パターン（DDD、Clean Architecture）は避ける
- 段階的開発と各段階での動作確認を徹底する

---

## 従来の技術仕様（参考）

### 対象機能（本来実装されるべき）

- **シリアル番号検索**: 単体または複数のシリアル番号を一度に検索
- **CSV一括検索**: CSVファイルから複数のシリアル番号を読み込んで一括検索
- **結果の可視化**: 保険状況を色分けして分かりやすく表示
- **CSV出力**: 検索結果をCSVファイルとしてダウンロード
- **モバイル対応**: スマートフォンでの使用を考慮したレスポンシブデザイン
- **使い方ガイド**: アプリ内にヘルプ機能を内蔵

## 技術スタック

### フロントエンド
- **React 19** + TypeScript
- **Vite** - ビルドツール
- **Tailwind CSS** + **DaisyUI** - スタイリング
- **Lucide React** - アイコン
- **React Hot Toast** - 通知
- **SWR** - データフェッチング
- **React Error Boundary** - エラーハンドリング

### バックエンド
- **PocketBase** - BaaS（Backend as a Service）
- **Go** - PocketBaseの拡張とカスタマイズ

### 開発ツール
- **Task** - タスクランナー
- **Air** - Go Hot Reload
- **Biome** - Linter/Formatter

## プロジェクト構成

```
├── frontend/           # Reactアプリケーション
│   ├── src/
│   │   ├── components/ # UIコンポーネント
│   │   ├── hooks/      # カスタムhooks
│   │   ├── lib/        # ライブラリ・API設定
│   │   └── types/      # TypeScript型定義
│   └── package.json
├── config/             # PocketBase設定
├── migrations/         # データベースマイグレーション
├── pb_data/           # PocketBaseデータディレクトリ
├── sample_data.csv    # サンプルデータ
├── main.go           # PocketBaseエントリーポイント
└── Taskfile.yml      # タスク定義
```

## データベーススキーマ

### users (認証用)
PocketBaseのデフォルトユーザーコレクション

### serial_numbers (ベースコレクション)
```
- id: text (Primary Key)
- serial_number: text (必須、一意)
- is_insurance: boolean (必須)
- created: timestamp (自動設定)
- updated: timestamp (自動更新)
```

## セットアップ

### 1. 環境設定

```bash
# プロジェクトのクローンと依存関係インストール
cd ns_assuarance
task backend:install-deps
task frontend:install-deps
```

### 2. Google OAuth設定

1. [Google Cloud Console](https://console.cloud.google.com/)でプロジェクトを作成
2. OAuth 2.0 クライアントIDを作成
3. `config.yaml`にクライアント情報を設定:

```yaml
backend:
  google:
    client_id: "your-google-client-id"
    client_secret: "your-google-client-secret"
    name: "端末保険確認システム"
```

### 3. データベース初期化

```bash
# PocketBaseの初回起動（管理者アカウント作成）
task dev:backend

# 管理画面でserial_numbersコレクションを作成
# http://localhost:9991/_/
```

## 使い方

### 開発環境の起動

```bash
# 依存関係のインストールと開発サーバーの起動
task dev

# または個別に起動
task dev:frontend  # フロントエンド開発サーバー
task dev:backend   # PocketBase開発サーバー
```

### データの投入

1. サンプルデータを使用する場合:
```bash
# sample_data.csvを参考にデータを用意
# PocketBase管理画面からCSVをインポート
```

2. PocketBaseコマンドを使用する場合:
```bash
# bulk insertを実行（データ準備後）
./tekitou serve --http=localhost:9991
# 管理画面: http://localhost:9991/_/ 
```

### 本番環境へのデプロイ

```bash
# フロントエンドをビルドしてGoバイナリに埋め込み
task build

# 実行可能ファイルを起動
./tekitou serve --http=localhost:8090
```

## 画面仕様

### ログイン画面
- Googleアカウントでの認証
- システムの概要説明
- 主要機能の紹介

### 検索画面
- シリアル番号のテキスト入力（単体・複数対応）
- CSVファイルのアップロード機能
- 使い方ガイドの表示

### 結果画面
- 検索結果の色分け表示
  - 🟢 緑: 保険有り
  - 🟠 オレンジ: 未保険
  - 🔴 赤: エラー
- CSV形式での結果出力
- 統計情報の表示

## UI/UX設計の考慮点

1. **モバイルファースト**: スマートフォンでの使用を優先
2. **素早い判別**: 結果を色分けして視覚的に分かりやすく
3. **一括処理**: 複数台の端末を効率的に確認
4. **エラーハンドリング**: 分かりやすいエラーメッセージ
5. **アクセシビリティ**: 適切なセマンティクスとキーボードナビゲーション

## 想定される使用シーン

- 📱 **現場での確認**: 貸出時の保険状況チェック
- 📊 **一括チェック**: 複数台の端末状況を一度に確認
- 📋 **レポート作成**: 検索結果をCSV出力して報告書作成
- 🔍 **トラブル対応**: 問題が発生した端末の保険状況確認