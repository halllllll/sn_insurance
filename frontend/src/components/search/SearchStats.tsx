// import { BarChart3, Download } from "lucide-react";
// import type { SearchStats as SearchStatsType } from "../../hooks/useSerialNumberSearch";

// interface SearchStatsProps {
// 	stats: SearchStatsType;
// 	onCsvDownload: () => void;
// }

// export function SearchStats({ stats, onCsvDownload }: SearchStatsProps) {
// 	return (
// 		<div className="card bg-base-100 shadow-lg">
// 			<div className="card-body">
// 				<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
// 					{/* 統計情報 */}
// 					<div className="flex items-center gap-2">
// 						<BarChart3 className="w-5 h-5 text-primary" />
// 						<h3 className="text-lg font-semibold">検索統計</h3>
// 					</div>

// 					{/* CSV出力ボタン */}
// 					<button
// 						type="button"
// 						onClick={onCsvDownload}
// 						className="btn btn-outline btn-sm"
// 						disabled={stats.total === 0}
// 					>
// 						<Download className="w-4 h-4" />
// 						CSV出力
// 					</button>
// 				</div>

// 				{/* 統計データ */}
// 				<div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
// 					<div className="stat place-items-center p-4">
// 						<div className="stat-title text-xs">総数</div>
// 						<div className="stat-value text-lg text-primary">{stats.total}</div>
// 					</div>

// 					<div className="stat place-items-center p-4">
// 						<div className="stat-title text-xs">発見</div>
// 						<div className="stat-value text-lg text-info">{stats.found}</div>
// 					</div>

// 					<div className="stat place-items-center p-4">
// 						<div className="stat-title text-xs">保険済み</div>
// 						<div className="stat-value text-lg text-success">
// 							{stats.insured}
// 						</div>
// 					</div>

// 					<div className="stat place-items-center p-4">
// 						<div className="stat-title text-xs">未保険</div>
// 						<div className="stat-value text-lg text-warning">
// 							{stats.notInsured}
// 						</div>
// 					</div>

// 					<div className="stat place-items-center p-4">
// 						<div className="stat-title text-xs">未発見</div>
// 						<div className="stat-value text-lg text-error">
// 							{stats.notFound}
// 						</div>
// 					</div>
// 				</div>

// 				{/* プログレスバー */}
// 				{stats.total > 0 && (
// 					<div className="space-y-2">
// 						<div className="flex justify-between text-sm">
// 							<span>保険加入率</span>
// 							<span>
// 								{stats.found > 0
// 									? Math.round((stats.insured / stats.found) * 100)
// 									: 0}
// 								%
// 							</span>
// 						</div>
// 						<progress
// 							className="progress progress-success w-full"
// 							value={stats.found > 0 ? stats.insured : 0}
// 							max={stats.found}
// 						/>

// 						<div className="flex justify-between text-sm">
// 							<span>発見率</span>
// 							<span>{Math.round((stats.found / stats.total) * 100)}%</span>
// 						</div>
// 						<progress
// 							className="progress progress-info w-full"
// 							value={stats.found}
// 							max={stats.total}
// 						/>
// 					</div>
// 				)}
// 			</div>
// 		</div>
// 	);
// }
