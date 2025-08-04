# 組織設定機能のセットアップガイド

## 概要
このアプリケーションでは、PocketBaseの`organization_settings`コレクションを通じて、アプリケーションのタイトルや組織の情報を動的に変更できる機能を実装しています。

## 1. データベース設定の反映

### マイグレーションの実行
新しく作成した`organization_settings`コレクションを有効にするため、アプリケーションを再起動してマイグレーションを実行します：

```bash
# アプリケーションの停止
# 開発中の場合は Ctrl+C でサーバーを停止

# アプリケーションの再起動
go run main.go serve
```

マイグレーション`1754213000_create_organization_settings.go`が自動的に実行され、以下のフィールドを持つ`organization_settings`コレクションが作成されます：

- `app_title` (text): アプリケーションタイトル
- `organization_name` (text): 組織名
- `contact_email` (text): 連絡先メールアドレス
- `app_description` (text): アプリケーションの説明
- `maintenance_mode` (bool): メンテナンスモード
- `maintenance_message` (text): メンテナンス時のメッセージ

## 2. PocketBase管理画面での設定

### 管理画面へのアクセス
1. ブラウザで `http://localhost:8080/_/` にアクセス
2. 管理者アカウントでログイン

### 組織設定の入力
1. 左メニューから **Collections** をクリック
2. `organization_settings` コレクションを選択
3. **New record** ボタンをクリック
4. 以下の項目を入力：

| フィールド | 説明 | 例 |
|------------|------|-----|
| app_title | ヘッダーに表示されるアプリタイトル | "NS保険証券検索システム" |
| organization_name | 組織名（ログイン画面等で表示） | "株式会社サンプル" |
| contact_email | 問い合わせ先メールアドレス | "support@example.com" |
| app_description | アプリケーションの説明文 | "保険証券番号を検索できるシステムです" |
| maintenance_mode | メンテナンスモード（true/false） | false |
| maintenance_message | メンテナンス時の表示メッセージ | "システムメンテナンス中です" |

5. **Create** ボタンをクリックして保存

## 3. フロントエンド側での反映確認

設定が正しく反映されているか確認：

### アプリケーションヘッダー
- `app_title`で設定した値がページ上部に表示される
- デフォルト値: "保険証券番号検索"

### ログイン画面
- `organization_name`で設定した値がログイン画面に表示される
- `app_description`で設定した説明文が表示される

### 設定の更新
- PocketBase管理画面で設定を変更すると、フロントエンドは5分間隔で自動更新
- 即座に反映したい場合はブラウザをリロード

## 4. 実装の詳細

### バックエンド（Go/PocketBase）
- **マイグレーションファイル**: `migrations/1754213000_create_organization_settings.go`
- 現在のPocketBase APIパターンを使用（`core.NewBaseCollection`、直接フィールド作成）

### フロントエンド（React/TypeScript）
- **設定フック**: `frontend/src/hooks/useOrganizationSettings.ts`
- **SWRキャッシュ**: 5分間隔での自動更新
- **使用箇所**:
  - `AppHeader.tsx`: 動的タイトル表示
  - `LoginForm.tsx`: 組織名・説明文表示

### 設定のカスタマイズ例

```typescript
// frontend/src/hooks/useOrganizationSettings.ts
// キャッシュ間隔を変更したい場合
const { data: settings } = useSWR(
  'organization_settings',
  fetchOrganizationSettings,
  {
    refreshInterval: 60000, // 1分間隔に変更
    revalidateOnFocus: false,
  }
)
```

## 5. トラブルシューティング

### よくある問題

**Q: 設定を変更したのに反映されない**
A: 以下を確認してください：
- PocketBase管理画面で正しく保存されているか
- ブラウザのキャッシュをクリア
- 開発者ツールのNetworkタブでAPIリクエストを確認

**Q: マイグレーションが実行されない**
A: 以下を試してください：
- アプリケーションを完全に停止して再起動
- `pb_data/`フォルダの権限を確認
- ログでマイグレーションエラーを確認

**Q: デフォルト値が表示される**
A: 以下を確認してください：
- `organization_settings`コレクションにレコードが作成されているか
- フロントエンドのAPIエンドポイントが正しいか
- ネットワーク接続の問題がないか

## 6. セキュリティ考慮事項

- `organization_settings`コレクションは認証済みユーザーのみ読み取り可能
- 管理者のみが設定を変更可能
- 機密情報（パスワード等）は含めない
- XSS対策のため、HTMLタグの使用は避ける

## 7. 今後の拡張案

- ロゴ画像のアップロード機能
- 多言語対応設定
- テーマカラーのカスタマイズ
- メール通知設定
- アクセス権限の詳細設定
