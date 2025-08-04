import { FileUp, Search, X } from "lucide-react";

interface HelpModalProps {
	isOpen: boolean;
	onClose: () => void;
}

export function HelpModal({ isOpen, onClose }: HelpModalProps) {
	if (!isOpen) return null;

	return (
		<div className="modal modal-open">
			<div className="modal-box max-w-4xl">
				<div className="flex justify-between items-center mb-4">
					<h3 className="font-bold text-lg">使い方ガイド</h3>
					<button
						type="button"
						onClick={onClose}
						className="btn btn-sm btn-circle btn-ghost"
					>
						<X className="w-4 h-4" />
					</button>
				</div>

				<div className="space-y-6">
					{/* 基本的な使い方 */}
					<div className="space-y-3">
						<h4 className="font-semibold flex items-center gap-2">
							<Search className="w-5 h-5 text-primary" />
							基本的な検索方法
						</h4>
						<div className="bg-base-200 p-4 rounded-lg space-y-2">
							<p>
								<strong>クイック検索:</strong>{" "}
								2文字以上入力すると候補が自動表示されます
							</p>
							<p>
								<strong>一括検索:</strong>{" "}
								複数のシリアルナンバーを改行またはカンマで区切って入力し、「一括検索」ボタンをクリック（最大100件まで）
							</p>
						</div>
					</div>

					{/* 入力例 */}
					<div className="space-y-3">
						<h4 className="font-semibold">入力例</h4>
						<div className="grid md:grid-cols-2 gap-4">
							<div className="bg-base-200 p-4 rounded-lg">
								<p className="font-medium mb-2">改行区切り:</p>
								<pre className="text-sm whitespace-pre-wrap">
									${`ABC123\nDEF456\nGHI789`}
								</pre>
							</div>
							<div className="bg-base-200 p-4 rounded-lg">
								<p className="font-medium mb-2">カンマ区切り:</p>
								<pre className="text-sm">ABC123, DEF456, GHI789</pre>
							</div>
						</div>
					</div>

					{/* CSV機能 */}
					<div className="space-y-3">
						<h4 className="font-semibold flex items-center gap-2">
							<FileUp className="w-5 h-5 text-secondary" />
							CSV機能
						</h4>
						<div className="bg-base-200 p-4 rounded-lg space-y-2">
							<p>
								<strong>CSV読み込み:</strong>{" "}
								「CSV読込」ボタンをクリックしてCSVファイルを選択
							</p>
							<p>CSVファイルの最初の列がシリアルナンバーとして認識されます</p>
							<p>
								<strong>CSV出力:</strong>{" "}
								検索結果を「CSV出力」ボタンでダウンロード可能
							</p>
						</div>
					</div>

					{/* 結果の見方 */}
					<div className="space-y-3">
						<h4 className="font-semibold">検索結果の見方</h4>
						<div className="space-y-2">
							<div className="flex items-center gap-2">
								<span className="badge badge-success">保険加入済み</span>
								<span>保険に加入している端末</span>
							</div>
							<div className="flex items-center gap-2">
								<span className="badge badge-warning">未加入</span>
								<span>保険に加入していない端末</span>
							</div>
							<div className="flex items-center gap-2">
								<span className="badge badge-warning">見つからない</span>
								<span>データベースに登録されていない端末</span>
							</div>
							<div className="flex items-center gap-2">
								<span className="badge badge-error">エラー</span>
								<span>検索中にエラーが発生した端末</span>
							</div>
						</div>
					</div>

					{/* 制限事項 */}
					<div className="space-y-3">
						<h4 className="font-semibold">制限事項</h4>
						<div className="bg-warning/10 p-4 rounded-lg">
							<ul className="list-disc list-inside space-y-1 text-sm">
								<li>一度に検索できるシリアルナンバーは最大100件です</li>
								<li>リアルタイム検索は2文字以上の入力で動作します</li>
								<li>CSVファイルの最初の列のみが読み込まれます</li>
							</ul>
						</div>
					</div>
				</div>

				<div className="modal-action">
					<button type="button" onClick={onClose} className="btn btn-primary">
						閉じる
					</button>
				</div>
			</div>
		</div>
	);
}
