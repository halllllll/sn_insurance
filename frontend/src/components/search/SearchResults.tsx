import { AlertTriangle, Shield, X } from "lucide-react";
import type { SearchResult } from "../../hooks/useSerialNumberSearch";

interface SearchResultsProps {
	results: SearchResult[];
}

export function SearchResults({ results }: SearchResultsProps) {
	if (results.length === 0) return null;

	const getStatusIcon = (result: SearchResult) => {
		if (result.error) return <X className="w-4 h-4" />;
		if (!result.found) return <AlertTriangle className="w-4 h-4" />;
		return <Shield className="w-4 h-4" />;
	};

	const getStatusColor = (result: SearchResult) => {
		if (result.error) return "text-error";
		if (!result.found) return "text-warning";
		return result.is_insurance ? "text-success" : "text-warning";
	};

	const getStatusText = (result: SearchResult) => {
		if (result.error) return "検索エラー";
		if (!result.found) return "見つからない";
		return result.is_insurance ? "保険加入済み" : "未加入";
	};

	const getBadgeClass = (result: SearchResult) => {
		if (result.error) return "badge-error";
		if (!result.found) return "badge-warning";
		return result.is_insurance ? "badge-success" : "badge-warning";
	};

	return (
		<div className="card bg-base-100 shadow-lg">
			<div className="card-body">
				<h2 className="card-title">検索結果 ({results.length}件)</h2>

				<div className="overflow-x-auto">
					<table className="table table-zebra w-full">
						<thead>
							<tr>
								<th>シリアルナンバー</th>
								<th>保険状況</th>
								<th>詳細</th>
							</tr>
						</thead>
						<tbody>
							{results.map((result) => (
								<tr key={result.serial_number} className="hover">
									<td>
										<div className="font-mono font-medium">
											{result.serial_number}
										</div>
									</td>
									<td>
										<div
											className={`flex items-center gap-2 ${getStatusColor(result)}`}
										>
											{getStatusIcon(result)}
											<span className="font-medium">
												{getStatusText(result)}
											</span>
										</div>
									</td>
									<td>
										<span className={`badge ${getBadgeClass(result)}`}>
											{result.error
												? "エラー"
												: result.found
													? "検索済み"
													: "未発見"}
										</span>
										{result.error && (
											<div className="text-xs text-error mt-1">
												{result.error}
											</div>
										)}
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</div>
		</div>
	);
}
