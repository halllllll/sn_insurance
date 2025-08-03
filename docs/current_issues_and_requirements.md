# 現在の問題と要求仕様書

## 概要
このドキュメントは、2025年8月3日時点での端末保険状況確認システムの現在の状況、問題点、および正しく動作すべき仕様をまとめたものです。

## 現在の問題状況

### 1. 機能復元の失敗
- ユーザーが「元の状態に戻っていません」と指摘
- CSV読み込み機能が正常に動作していない可能性
- リアルタイム検索が動作していない
- 普通の検索も効かなくなっている
- Footerが常時表示されていない
- 使い勝手が悪化している

### 2. アーキテクチャの混乱
- 最初にDDD（ドメイン駆動設計）とClean Architectureを導入したが、フロントエンドには複雑すぎると判断
- ユーザーは「動くコードが第一で、それを読めることが第二」を重視
- 過度な設計パターンよりもシンプルで機能する実装を求めている

## 正しく動作すべき仕様

### 基本要件
1. **単一検索**: シリアル番号1つを検索、Enterキーでも実行可能
2. **一括検索**: 複数のシリアル番号を改行・カンマ区切りで入力、最大50件
3. **リアルタイム検索**: 2文字以上の入力で候補をリアルタイム表示、類似度スコア付き
4. **CSV読み込み**: CSVファイルをアップロードして一括検索
5. **CSV出力**: 検索結果をCSVファイルでダウンロード
6. **統計情報**: 検索結果の統計（総数、見つかった数、保険加入数など）
7. **Footer**: 常時表示されるフッターコンポーネント

### UI/UX要件
- daisyUIを使用したデザイン
- モバイルファースト、レスポンシブデザイン
- 保険状況の色分け表示（緑：保険済み、オレンジ：未保険、赤：エラー）
- 使い方ガイド（ヘルプ機能）
- ローディング状態の表示
- エラーハンドリング

### 技術仕様
- React 19 + TypeScript
- PocketBaseをバックエンドとして使用
- DaisyUIでスタイリング
- Viteをビルドツールとして使用

## 現在のファイル構成（2025年8月3日時点）

### フロントエンドコンポーネント
```
frontend/src/components/
├── AuthProvider.tsx           # 認証プロバイダー
├── LoginForm.tsx             # ログイン画面
├── MainApp.tsx               # メインアプリケーション（Footer追加済み）
├── SearchScreen.tsx          # 検索画面（全機能実装済みだが動作不良）
├── SearchScreenNew.tsx       # 削除済み（リネーム済み）
├── DeviceSearchForm.tsx      # React 19 useフック使用の高度な検索
└── parts/
    └── Footer.tsx            # フッターコンポーネント
```

### フック
```
frontend/src/hooks/
├── useSerialNumbers.ts       # 基本的な検索機能
├── useIncrementalSearchV2.ts # リアルタイム検索（類似度計算付き）
└── type.ts                   # 型定義
```

### サービス層・ドメイン層
```
frontend/src/
├── services/
│   └── deviceService.ts      # デバイス検索サービス
├── domain/
│   └── entities/
│       └── Device.ts         # デバイスエンティティと型定義
└── types/
    └── serial_number.ts      # SerialNumber型定義
```

## 既知の動作する部分

### 認証機能
- GoogleOAuth認証は正常に動作
- PocketBaseとの連携も問題なし

### データベース
- `users`コレクション（PocketBaseデフォルト）
- `serial_numbers`コレクション
  - `serial_number`: string（必須、一意）
  - `is_insurance`: boolean（必須）
  - `created`: timestamp
  - `updated`: timestamp

### バックエンド
- Go + PocketBase
- CSV一括インポート機能あり（`main.go`の`bulk-insert`コマンド）
- マイグレーション設定済み

## 問題のある実装箇所

### 1. SearchScreen.tsx
- 全機能が実装されているように見えるが、実際には動作していない
- リアルタイム検索の統合がうまくいっていない可能性
- CSV読み込み機能の実装に問題がある可能性

### 2. useIncrementalSearchV2.ts
- PocketBaseのクエリ構文に問題がある可能性
- 類似度計算のロジックは実装されているが、UIとの連携で問題

### 3. 複数のコンポーネントの競合
- `SearchScreen.tsx`、`DeviceSearchForm.tsx`、サービス層など複数の実装が混在
- どれを使うべきかが不明確

## 次のLLMへの指示

### 優先順位1: 動作する基本実装の作成
1. シンプルで確実に動作する`SearchScreen.tsx`を作成
2. 複雑なアーキテクチャパターンは避け、React hooksを直接使用
3. PocketBaseの基本的なクエリのみを使用

### 優先順位2: 段階的な機能追加
1. まず単一検索を確実に動作させる
2. 次に一括検索を追加
3. 最後にリアルタイム検索とCSV機能を追加

### 優先順位3: 既存ファイルの整理
1. 動作しない/不要なファイルを特定して削除
2. 使用するファイルを明確化
3. インポート関係を整理

### 検証方法
1. 各機能を段階的にテスト
2. ブラウザのコンソールエラーを確認
3. PocketBaseのクエリが正しく実行されているかを確認

### 避けるべきこと
- DDD、Clean Architectureなどの複雑な設計パターン
- React 19の高度な機能（useフックなど）の乱用
- 過度な抽象化
- 一度に全機能を実装すること

## 参考情報

### PocketBaseクエリの正しい構文
```javascript
// 完全一致
pb.collection('serial_numbers').getList(1, 10, {
  filter: 'serial_number = "ABC123"'
});

// 部分一致
pb.collection('serial_numbers').getList(1, 10, {
  filter: 'serial_number ~ "ABC%"'
});
```

### 型定義（serial_number.ts）
```typescript
export interface SerialNumber {
  collectionId: string;
  collectionName: string;
  id: string;
  serial_number: string;
  is_insurance: boolean;  // 注意: is_insuredではない
  created: string;
  updated: string;
}
```

## 最終的な目標
「動くコードが第一で、それを読めることが第二」というユーザーの要望に従い、確実に動作するシンプルな実装を提供する。美しいアーキテクチャよりも実用性を重視する。
