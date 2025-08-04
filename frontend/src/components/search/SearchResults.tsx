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
		return result.is_insurance ? "text-success" : "text-secondary";
	};

	const getStatusText = (result: SearchResult) => {
		if (result.error) return "検索エラー";
		if (!result.found) return "見つからない";
		return result.is_insurance ? "保険加入済み" : "未加入";
	};

	return (
		<div className="overflow-x-auto">
			<table className="table table-zebra w-full">
				<thead>
					<tr>
						<th>シリアルナンバー</th>
						<th>保険状況</th>
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
									<span className="font-medium">{getStatusText(result)}</span>
									{result.error && (
										<div className="text-xs text-error ml-2">
											({result.error})
										</div>
									)}
								</div>
							</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
}
