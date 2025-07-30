import { type FC, Suspense } from "react";
import { useSerialNumbers } from "../hooks/useSerialNumbers";
import { useAuth } from "./AuthProvider";

function Loading() {
	return (
		<div className="p-4">
			<h2 className="text-lg font-bold mb-4">シリアル番号一覧</h2>
			<div className="flex items-center gap-2">
				<span className="loading loading-spinner loading-sm"></span>
				<span>読み込み中...</span>
			</div>
		</div>
	);
}

function SNList() {
	const { data: serialNumbers, error, isLoading, mutate } = useSerialNumbers();
	if (isLoading) {
		return <Loading />;
	}
	if (error) {
		return (
			<div className="p-4">
				<h2 className="text-lg font-bold mb-4">シリアル番号一覧</h2>
				<div className="alert alert-error mb-4">
					<span>{error}</span>
				</div>
				<button
					type="button"
					onClick={() => mutate()}
					className="btn btn-primary"
				>
					再試行
				</button>
			</div>
		);
	}

	return (
		<div className="p-4">
			<div className="flex justify-between items-center mb-4">
				<h2 className="text-lg font-bold">
					シリアル番号一覧 ({serialNumbers?.length || 0}件)
				</h2>
				<button type="button" onClick={() => mutate()} className="btn btn-sm">
					更新
				</button>
			</div>

			{!serialNumbers || serialNumbers.length === 0 ? (
				<p>データがありません</p>
			) : (
				<table className="table table-zebra">
					<thead>
						<tr>
							<th>シリアル番号</th>
							<th>保証状況</th>
							<th>登録日</th>
						</tr>
					</thead>
					<tbody>
						{serialNumbers.map((sn) => (
							<tr key={sn.id}>
								<td>{sn.serial_number}</td>
								<td>
									<span
										className={`badge ${sn.is_assuarance ? "badge-success" : "badge-warning"}`}
									>
										{sn.is_assuarance ? "保証済み" : "未保証"}
									</span>
								</td>
								<td>{new Date(sn.created).toLocaleDateString("ja-JP")}</td>
							</tr>
						))}
					</tbody>
				</table>
			)}
		</div>
	);
}

export const MainApp: FC = () => {
	const { logout, isAuthenticated, user } = useAuth();

	if (!isAuthenticated || !user) {
		return null;
	}

	return (
		<div className="min-h-screen flex flex-col">
			{/* ヘッダー */}
			<header className="bg-white shadow-sm p-4">
				<div className="flex justify-between items-center max-w-4xl mx-auto">
					<div>
						<h1 className="text-xl font-bold">
							Welcome, {user.name || user.email}
						</h1>
						<p className="text-sm text-gray-600">シリアル番号管理システム</p>
					</div>
					<button
						type="button"
						onClick={logout}
						className="btn btn-outline btn-sm"
					>
						ログアウト
					</button>
				</div>
			</header>

			{/* メインコンテンツ */}
			<main className="flex-1 max-w-4xl mx-auto w-full">
				<Suspense fallback={<Loading />}>
					<SNList />
				</Suspense>
			</main>

			{/* フッター */}
			<footer className="p-4 text-center text-sm text-gray-500 border-t">
				© 2025 シリアル番号管理システム
			</footer>
		</div>
	);
};
