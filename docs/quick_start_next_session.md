# 次回作業のためのクイックスタートガイド

## 現在の状況（2025年8月3日）
アプリケーションの検索機能が動作しない状態です。認証とUIレイアウトは動作しています。

## 即座に確認すべき事項

### 1. アプリケーションの起動
```bash
task dev
```

### 2. 動作確認
1. ブラウザで http://localhost:10101 にアクセス
2. Google認証でログイン
3. 検索画面で何かを検索してみる
4. ブラウザの開発者ツールでコンソールエラーを確認

### 3. 重要なファイルの確認
- `frontend/src/components/SearchScreen.tsx` - メイン検索画面
- `frontend/src/hooks/useSerialNumbers.ts` - 基本検索フック
- `frontend/src/hooks/useIncrementalSearchV2.ts` - リアルタイム検索フック
- `frontend/src/types/serial_number.ts` - 型定義

## 推奨する修正アプローチ

### Step 1: 最小限の動作実装
まず単一検索だけを確実に動作させる：

```typescript
// 最小限のSearchScreen.tsx例
import { useState } from 'react';
import { pb } from '../lib/pocketbase';

export function SearchScreen() {
  const [query, setQuery] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    setLoading(true);
    try {
      const records = await pb.collection('serial_numbers').getList(1, 1, {
        filter: `serial_number = "${query.trim().toUpperCase()}"`
      });
      setResult(records.items[0] || null);
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  };

  return (
    <div className="p-4">
      <input 
        value={query} 
        onChange={(e) => setQuery(e.target.value)}
        className="input input-bordered"
      />
      <button onClick={handleSearch} disabled={loading}>
        検索
      </button>
      {result && (
        <div>
          <p>シリアル: {result.serial_number}</p>
          <p>保険: {result.is_insurance ? '加入済み' : '未加入'}</p>
        </div>
      )}
    </div>
  );
}
```

### Step 2: 段階的機能追加
1. 単一検索 → 一括検索 → リアルタイム検索 → CSV機能の順
2. 各段階で必ず動作確認
3. エラーハンドリングとローディング状態を適切に実装

### Step 3: 既存ファイルの整理
不要な複雑化されたファイルを削除し、シンプルな構成に統一

## 避けるべきこと
- 一度に全機能を実装
- 複雑な設計パターンの導入
- 動作確認を怠ること
- 推測による実装

## トラブルシューティング

### PocketBaseクエリが動かない場合
- フィルター構文を確認: `serial_number = "ABC123"`
- 認証状態を確認: ログインしているか
- コレクション名を確認: `serial_numbers`

### TypeScriptエラーが出る場合
- 型定義を確認: `is_insurance` (not `is_insured`)
- インポートパスを確認
- null/undefinedチェックを追加

### UIが表示されない場合
- daisyUIのクラス名を確認
- CSSが正しく読み込まれているか確認

## 連絡先
このドキュメントを作成したセッションでの作業は完了しています。
次のLLMセッションで引き続き作業を行ってください。
