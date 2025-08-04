# Next Action Items - 継続的改善タスク

## 概要
このドキュメントは、プロジェクト振り返り分析の結果として特定された、継続的改善のためのアクションアイテムをまとめたものです。

---

## 🔥 Priority 1: 即座実行（1週間以内）

### 1.1 パフォーマンス監視の実装
**タスク**: 検索パフォーマンス計測機能の追加
**推定工数**: 0.5人日
**担当**: Frontend Developer

```typescript
// 実装例
const useSearchAnalytics = () => {
  const trackSearch = useCallback((query: string, duration: number, resultCount: number) => {
    // ローカルストレージに蓄積
    const metrics = {
      timestamp: Date.now(),
      query_length: query.length,
      duration,
      result_count: resultCount,
      user_agent: navigator.userAgent.includes('Mobile') ? 'mobile' : 'desktop'
    };
    
    const stored = JSON.parse(localStorage.getItem('search_metrics') || '[]');
    stored.push(metrics);
    localStorage.setItem('search_metrics', JSON.stringify(stored.slice(-100))); // 最新100件保持
  }, []);
  
  return { trackSearch };
};
```

**完了基準**:
- [ ] 検索実行時間の自動計測
- [ ] ローカルストレージでの蓄積
- [ ] 管理画面での確認機能

### 1.2 ユーザーフィードバック収集機構
**タスク**: フィードバックボタンとフォームの実装
**推定工数**: 1人日
**担当**: Frontend Developer

```tsx
// 実装例
const FeedbackButton: FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [feedback, setFeedback] = useState('');
  
  const submitFeedback = async () => {
    await pb.collection('feedback').create({
      content: feedback,
      timestamp: new Date(),
      user_id: pb.authStore.model?.id,
      page: location.pathname
    });
    toast.success('フィードバックありがとうございます！');
  };
  
  return (
    <div className="fixed bottom-4 right-4">
      <button onClick={() => setIsOpen(true)} className="btn btn-primary">
        📝 フィードバック
      </button>
      {/* Modal implementation */}
    </div>
  );
};
```

**完了基準**:
- [ ] フィードバックボタンの配置
- [ ] フィードバック収集フォーム
- [ ] PocketBaseでの蓄積機能

---

## 🟡 Priority 2: 短期実行（1ヶ月以内）

### 2.1 React 19機能の完全活用
**タスク**: useActionStateを活用した認証フローの改善
**推定工数**: 2人日
**担当**: Frontend Developer

```typescript
// 実装例
const useGoogleAuth = () => {
  const [state, formAction, isPending] = useActionState(
    async (prevState: AuthState, formData: FormData) => {
      try {
        const authData = await authApi.loginWithGoogle();
        return { 
          success: true, 
          user: authData.record, 
          error: null 
        };
      } catch (error) {
        return { 
          success: false, 
          user: null, 
          error: error.message 
        };
      }
    },
    { success: false, user: null, error: null }
  );
  
  return { state, formAction, isPending };
};
```

**完了基準**:
- [ ] LoginForm.tsxのuseActionState移行
- [ ] エラーハンドリングの統一
- [ ] TypeScript型安全性の向上

### 2.2 データフェッチング戦略の統一
**タスク**: SWRベースの統一API層の実装
**推定工数**: 3人日
**担当**: Frontend Developer

```typescript
// 実装例
export const useSearchApi = () => {
  const searchSingle = useSWRMutation(
    'search/single',
    (key: string, { arg }: { arg: string }) => 
      pb.collection('serial_numbers').getList(1, 1, {
        filter: `serial_number = "${arg.toUpperCase()}"`
      })
  );
  
  const searchBatch = useSWRMutation(
    'search/batch',
    (key: string, { arg }: { arg: string[] }) => 
      Promise.all(arg.map(sn => searchSingle.trigger(sn)))
  );
  
  return { searchSingle, searchBatch };
};
```

**完了基準**:
- [ ] 統一されたAPI層の実装
- [ ] 既存hooksのリファクタリング
- [ ] キャッシュ戦略の統一

### 2.3 エラー監視システムの導入
**タスク**: Sentryまたは類似ツールの導入
**推定工数**: 1人日
**担当**: DevOps/Backend Developer

**完了基準**:
- [ ] エラー追跡システムの設定
- [ ] 本番環境でのモニタリング開始
- [ ] アラート設定の実装

---



このアクションプランにより、システムの継続的な改善と発展を確実にします。
