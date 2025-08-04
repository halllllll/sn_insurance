import { Download, FileUp, HelpCircle, Search } from "lucide-react";
import { useRef, useState } from "react";
import {
	type SearchResult,
	useRealtimeSearch,
	useSerialNumberSearch,
} from "../../hooks/useSerialNumberSearch";
import { HelpModal } from "./HelpModal";
import { SearchResults } from "./SearchResults";

export function SearchForm() {
	const [searchMode, setSearchMode] = useState<"quick" | "bulk">("quick");
	const [singleQuery, setSingleQuery] = useState("");
	const [bulkQuery, setBulkQuery] = useState("");
	const [searchTerms, setSearchTerms] = useState<string[]>([]);
	const [showSuggestions, setShowSuggestions] = useState(false);
	const [showHelp, setShowHelp] = useState(false);
	const fileInputRef = useRef<HTMLInputElement>(null);

	const { suggestions, isLoading: isLoadingSuggestions } = useRealtimeSearch(
		searchMode === "quick" ? singleQuery : "",
		showSuggestions,
	);
	const { results, isLoading: isSearching } =
		useSerialNumberSearch(searchTerms);

	// クイック検索
	const handleSingleSearch = () => {
		if (!singleQuery.trim()) return;
		setSearchTerms([singleQuery.trim()]);
		setShowSuggestions(false);
	};

	// 一括検索
	const handleBulkSearch = () => {
		if (!bulkQuery.trim()) return;

		const terms = bulkQuery
			.split(/[\n,]/)
			.map((term) => term.trim())
			.filter((term) => term.length > 0)
			.slice(0, 100);

		setSearchTerms(terms);
	};

	// CSVファイル読み込み
	const handleCsvFileSelect = async (file: File) => {
		try {
			const text = await file.text();
			const lines = text
				.split("\n")
				.map((line) => line.trim())
				.filter((line) => line);

			const serialNumbers = lines
				.map((line) => line.split(",")[0]?.trim())
				.filter((sn) => sn && sn.length > 0)
				.slice(0, 100);

			if (serialNumbers.length > 0) {
				setSearchTerms(serialNumbers);
				setBulkQuery(serialNumbers.join("\n"));
				setSearchMode("bulk");
			}
		} catch (error) {
			console.error("CSV読み込みエラー:", error);
		}
	};

	// 結果をCSV出力
	const handleCsvDownload = () => {
		if (results.length === 0) return;

		const csvContent = [
			["シリアルナンバー", "保険状況", "検索結果"],
			...results.map((result: SearchResult) => [
				result.serial_number,
				result.found
					? result.is_insurance
						? "加入済み"
						: "未加入"
					: "見つからない",
				result.found ? "○" : "×",
			]),
		]
			.map((row) => row.join(","))
			.join("\n");

		const blob = new Blob(["\uFEFF" + csvContent], {
			type: "text/csv;charset=utf-8;",
		});
		const link = document.createElement("a");
		link.href = URL.createObjectURL(blob);
		link.download = `検索結果_${new Date().toISOString().split("T")[0]}.csv`;
		link.click();
	};

	return (
		<div className="max-w-4xl mx-auto p-4 space-y-6">
			{/* ヘッダー */}
			<div className="text-center space-y-2">
				<h1 className="text-2xl font-bold text-primary flex items-center justify-center gap-2">
					<Search className="w-6 h-6" />
					端末保険状況確認
				</h1>
				<p className="text-base-content/70">
					シリアルナンバーを入力して保険状況を確認できます
				</p>
			</div>

			{/* 検索モード選択 */}
			<div className="card bg-base-100 shadow-lg">
				<div className="card-body">
					<div className="flex items-center justify-between mb-4">
						<h2 className="card-title">検索方法を選択</h2>
						<button
							type="button"
							onClick={() => setShowHelp(true)}
							className="btn btn-ghost btn-xs"
						>
							<HelpCircle className="w-4 h-4" />
							使い方
						</button>
					</div>

					{/* タブ */}
					<div className="tabs tabs-border mb-4">
						<button
							type="button"
							className={`tab ${searchMode === "quick" ? "tab-active" : ""}`}
							onClick={() => setSearchMode("quick")}
						>
							クイック検索
						</button>
						<button
							type="button"
							className={`tab ${searchMode === "bulk" ? "tab-active" : ""}`}
							onClick={() => setSearchMode("bulk")}
						>
							一括検索
						</button>
					</div>

					{/* クイック検索フォーム */}
					{searchMode === "quick" && (
						<div className="space-y-4">
							<div className="form-control">
								<label htmlFor="single-search-input" className="label">
									<span className="label-text font-medium">
										シリアルナンバー
									</span>
								</label>

								<div className="relative">
									<input
										id="single-search-input"
										type="text"
										className="input input-bordered w-full"
										placeholder="例: ABC123"
										value={singleQuery}
										onChange={(e) => {
											setSingleQuery(e.target.value);
											setShowSuggestions(e.target.value.length >= 2);
										}}
										onKeyDown={(e) => {
											if (e.key === "Enter") {
												e.preventDefault();
												handleSingleSearch();
											}
										}}
										onFocus={() => setShowSuggestions(singleQuery.length >= 2)}
										onBlur={() =>
											setTimeout(() => setShowSuggestions(false), 200)
										}
									/>

									{/* リアルタイム検索の候補表示 */}
									{showSuggestions && suggestions.length > 0 && (
										<div className="absolute z-10 w-full mt-1 bg-base-100 border border-base-300 rounded-lg shadow-lg max-h-48 overflow-y-auto">
											{suggestions.map(
												(suggestion: {
													serial_number: string;
													is_insurance: boolean;
												}) => (
													<button
														key={suggestion.serial_number}
														type="button"
														className="w-full text-left px-4 py-2 hover:bg-base-200 border-b border-base-300 last:border-b-0 flex justify-between items-center"
														onClick={() => {
															setSingleQuery(suggestion.serial_number);
															setShowSuggestions(false);
														}}
													>
														<span>{suggestion.serial_number}</span>
														<span
															className={`badge badge-sm ${suggestion.is_insurance ? "badge-success" : "badge-warning"}`}
														>
															{suggestion.is_insurance ? "保険有り" : "未保険"}
														</span>
													</button>
												),
											)}
										</div>
									)}

									{isLoadingSuggestions && showSuggestions && (
										<div className="absolute z-10 w-full mt-1 bg-base-100 border border-base-300 rounded-lg shadow-lg p-4 text-center">
											<span className="loading loading-spinner loading-sm mr-2"></span>
											検索中...
										</div>
									)}
								</div>
							</div>

							<button
								type="button"
								onClick={handleSingleSearch}
								disabled={!singleQuery.trim() || isSearching}
								className="btn btn-accent btn-lg w-full"
							>
								{isSearching ? (
									<>
										<span className="loading loading-spinner loading-sm"></span>
										検索中...
									</>
								) : (
									<>
										<Search className="w-4 h-4" />
										検索
									</>
								)}
							</button>
						</div>
					)}

					{/* 一括検索フォーム */}
					{searchMode === "bulk" && (
						<div className="space-y-4">
							<div className="form-control">
								<label htmlFor="bulk-search-input" className="label">
									<span className="label-text font-medium">
										シリアルナンバー（複数）
									</span>
								</label>

								<textarea
									id="bulk-search-input"
									className="textarea textarea-bordered w-full resize-none"
									placeholder="複数のシリアルナンバーを入力してください&#10;改行またはカンマで区切ってください&#10;例:&#10;ABC123&#10;DEF456&#10;GHI789&#10;&#10;最大100件まで対応"
									value={bulkQuery}
									onChange={(e) => setBulkQuery(e.target.value)}
								/>
							</div>

							<div className="flex gap-2">
								<button
									type="button"
									onClick={handleBulkSearch}
									disabled={!bulkQuery.trim() || isSearching}
									className="btn btn-lg btn-accent flex-1"
								>
									{isSearching ? (
										<>
											<span className="loading loading-spinner loading-sm"></span>
											検索中...
										</>
									) : (
										<>
											<Search className="w-4 h-4" />
											一括検索
										</>
									)}
								</button>

								<button
									type="button"
									onClick={() => fileInputRef.current?.click()}
									disabled={isSearching}
									className="btn btn-outline btn-lg"
								>
									<FileUp className="w-4 h-4" />
									CSV読込
								</button>
							</div>

							{/* ファイル入力（非表示） */}
							<input
								ref={fileInputRef}
								type="file"
								accept=".csv"
								className="hidden"
								onChange={(e) => {
									if (e.target.files?.[0]) {
										handleCsvFileSelect(e.target.files[0]);
									}
								}}
							/>
						</div>
					)}
				</div>
			</div>

			{/* 検索結果 */}
			{results.length > 0 && (
				<>
					{/* 結果サマリーとCSV出力 */}
					<div className="card bg-base-100 shadow-lg">
						<div className="card-body py-4">
							<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
								<div className="flex items-center gap-4">
									<span className="text-lg font-semibold">
										検索結果: {results.length}件
									</span>
									<div className="flex gap-2">
										<span className="badge badge-success">
											保険有り:{" "}
											{
												results.filter(
													(r: SearchResult) => r.found && r.is_insurance,
												).length
											}
										</span>
										<span className="badge badge-warning">
											未保険:{" "}
											{
												results.filter(
													(r: SearchResult) => r.found && !r.is_insurance,
												).length
											}
										</span>
										<span className="badge badge-error">
											未発見:{" "}
											{results.filter((r: SearchResult) => !r.found).length}
										</span>
									</div>
								</div>

								<button
									type="button"
									onClick={handleCsvDownload}
									className="btn btn-sm btn-outline"
								>
									<Download className="w-4 h-4" />
									CSV出力
								</button>
							</div>
						</div>
					</div>

					<SearchResults results={results} />
				</>
			)}

			{/* ヘルプモーダル */}
			<HelpModal isOpen={showHelp} onClose={() => setShowHelp(false)} />
		</div>
	);
}
