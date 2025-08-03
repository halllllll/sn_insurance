# ADR-001: 一括検索の100件制限設定

## Status
Accepted

## Context
一括検索機能において、同時に処理可能なシリアル番号の件数に制限を設ける必要があった。

### 技術的背景
- PocketBaseのAPI制限とレスポンス時間
- ブラウザのメモリ使用量とUI応答性
- モバイル環境での使用を考慮したパフォーマンス

### ビジネス要求
- 日常業務: 1-10件程度（80%）
- 定期チェック: 20-50件（15%）
- 大規模監査: 100件超（5%）

## Decision
一括検索の上限を **100件** に設定する。

### 実装
```typescript
if (serialNumbers.length > 100) {
  toast.error(`一度に検索できるのは100件までです\n現在: ${serialNumbers.length}件`);
  return;
}
```

## Consequences

### Positive
- ✅ サーバー負荷の制御
- ✅ UI応答性の維持
- ✅ モバイル環境での安定動作
- ✅ エラーハンドリングの簡素化

### Negative
- ❌ 大規模監査時の手動分割作業が必要
- ❌ 一部ユーザーのワークフロー制約

### Neutral
- 現在の使用パターン（95%）では問題なし
- 将来的な緩和策検討の余地あり

## Alternatives Considered

### Option A: 制限なし
- **問題**: サーバー負荷、ブラウザクラッシュリスク
- **却下理由**: 技術的リスクが高い

### Option B: 50件制限
- **問題**: 定期チェック業務への影響
- **却下理由**: ビジネス要求に対して過度に制限的

### Option C: 500件制限
- **問題**: 実装複雑度の増加
- **却下理由**: 現時点でのオーバーエンジニアリング

## Implementation Notes
- QuickSearch.tsx での制限チェック実装
- CSV読み込み時も同様の制限適用
- ユーザーフレンドリーなエラーメッセージ提供

## Future Considerations
- パフォーマンス監視による制限値の調整
- 段階的緩和策（500件 → 1000件）の検討
- バッチ処理による無制限対応の実装可能性

## References
- [QuickSearch.tsx Implementation](../frontend/src/components/QuickSearch.tsx)
- [Performance Analysis](./TECHNICAL_DEBT_ANALYSIS.md)
- [Project Retrospective](./PROJECT_RETROSPECTIVE.md)
