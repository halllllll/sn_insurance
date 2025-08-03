# ADR-002: サーバーサイド検索への移行

## Status
Accepted

## Context
初期実装では、インクリメンタル検索においてクライアントサイドで全データ（61,413件）をフェッチして検索処理を行っていた。

### 問題の発見
- **症状**: 123回のHTTPリクエストによる大量データフェッチ
- **影響**: 
  - 初回ロード時間: 10-30秒
  - データ転送量: 約30MB
  - モバイル環境での使用不可
  - ユーザー体験の著しい低下

### 根本原因
```typescript
// 問題のあった実装
const allData = await pb.collection('serial_numbers').getFullList<SerialNumber>();
// 500件ずつ取得するため、61,413件で123回のリクエスト
```

## Decision
**クライアントサイド全データフェッチ** から **サーバーサイド検索** への移行

### 新しいアプローチ
```typescript
// 最適化後の実装
const results = await pb.collection('serial_numbers').getList<SerialNumber>(1, maxResults, {
  filter: [
    `serial_number = "${normalizedQuery}"`,      // 完全一致
    `serial_number ~ "${normalizedQuery}%"`,     // 前方一致
    `serial_number ~ "%${normalizedQuery}%"`     // 部分一致
  ].join(' || '),
  sort: 'serial_number',
});
```

## Consequences

### Performance Improvement
- **リクエスト数**: 123回 → 1回（99.2%削減）
- **レスポンス時間**: 10-30秒 → 0.1-0.5秒（95%改善）
- **データ転送量**: 約30MB → 約10KB（99.9%削減）
- **初回表示**: 即座に利用可能

### User Experience
- ✅ モバイル環境での安定動作
- ✅ リアルタイム検索候補表示
- ✅ 即座のフィードバック
- ✅ ネットワーク使用量の大幅削減

### Technical Benefits
- ✅ スケーラビリティ向上
- ✅ サーバーリソース効率化
- ✅ キャッシュ戦略の簡素化
- ✅ エラーハンドリングの改善

## Implementation Details

### 類似度計算の保持
```typescript
const suggestions: SearchSuggestion[] = results.items.map(item => {
  const serialUpper = item.serial_number.toUpperCase();
  let similarity = 0.5;

  if (serialUpper === normalizedQuery) {
    similarity = 1.0; // 完全一致
  } else if (serialUpper.startsWith(normalizedQuery)) {
    similarity = 0.9; // 前方一致
  } else if (serialUpper.includes(normalizedQuery)) {
    similarity = 0.8; // 部分一致
  }

  return { ...item, similarity };
});
```

### データベースインデックス対応
```sql
CREATE INDEX IF NOT EXISTS idx_serial_numbers_serial_number 
ON serial_numbers (serial_number);
```

## Alternatives Considered

### Option A: フロントエンドキャッシング強化
- **問題**: 根本的解決にならない
- **却下理由**: データ量増加で破綻

### Option B: ElasticSearch導入
- **問題**: インフラ複雑度増加
- **却下理由**: オーバーエンジニアリング

### Option C: ページネーション実装
- **問題**: UX低下
- **却下理由**: リアルタイム検索要求に不適

## Trade-offs

### Benefits
- 圧倒的なパフォーマンス向上
- スケーラビリティ確保
- インフラコスト削減

### Costs
- PocketBaseクエリ依存
- サーバーサイド負荷増加（軽微）
- 実装複雑度の若干増加

## Monitoring and Validation

### Performance Metrics
```typescript
const measureSearchPerformance = (query: string, startTime: number) => {
  const duration = performance.now() - startTime;
  console.log(`Search "${query}" completed in ${duration}ms`);
  
  // Future: Send to analytics
  // analytics.track('search_performance', { query, duration });
};
```

### Success Criteria
- [x] レスポンス時間 < 1秒
- [x] モバイル環境対応
- [x] 機能性の完全保持
- [x] ユーザビリティ向上

## Future Considerations

### Short-term
- パフォーマンス監視の実装
- ユーザーフィードバック収集

### Long-term
- 全文検索エンジンの検討
- 更なる検索機能拡張
- アナリティクス実装

## References
- [useIncrementalSearchV2.ts](../frontend/src/hooks/useIncrementalSearchV2.ts)
- [Index Migration](../migrations/1754191900_add_serial_number_index.go)
- [Technical Debt Analysis](./TECHNICAL_DEBT_ANALYSIS.md)
- [Project Retrospective](./PROJECT_RETROSPECTIVE.md)
