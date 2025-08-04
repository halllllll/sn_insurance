import { FileText, Search, Shield } from "lucide-react";
import type { FC } from "react";
import { useAuth } from "./AuthProvider";

export const LoginForm: FC = () => {
	const { loginWithGoogle } = useAuth();

	return (
		<div className="min-h-screen bg-gradient-to-br from-primary/20 to-secondary/20">
			{/* ヘッダー */}
			<header className="bg-base-100/80 backdrop-blur-sm shadow-sm">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
					<div className="flex items-center">
						<Shield className="h-8 w-8 text-primary mr-3" />
						<h1 className="text-xl font-semibold text-base-content">
							端末保険状況確認システム
						</h1>
					</div>
				</div>
			</header>

			{/* メインコンテンツ */}
			<main className="flex-1 flex items-center justify-center p-4 pt-16">
				<div className="w-full max-w-md">
					<div className="card bg-base-100 shadow-xl">
						<div className="card-body">
							<div className="text-center mb-8">
								<div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
									<Search className="h-8 w-8 text-primary" />
								</div>
								<h2 className="text-2xl font-bold text-base-content mb-2">
									端末保険確認
								</h2>
								<p className="text-base-content/70">
									貸出端末のシリアル番号から
									<br />
									保険の有無を素早く確認できます
								</p>
							</div>

							{/* 機能紹介 */}
							<div className="space-y-3 mb-6">
								<div className="flex items-center gap-3 p-3 bg-base-200 rounded-lg">
									<Search className="w-5 h-5 text-primary" />
									<div>
										<div className="font-medium text-sm">高速検索</div>
										<div className="text-xs text-base-content/70">
											リアルタイム検索対応
										</div>
									</div>
								</div>
								<div className="flex items-center gap-3 p-3 bg-base-200 rounded-lg">
									<FileText className="w-5 h-5 text-secondary" />
									<div>
										<div className="font-medium text-sm">一括処理</div>
										<div className="text-xs text-base-content/70">
											CSV読込・出力対応
										</div>
									</div>
								</div>
								<div className="flex items-center gap-3 p-3 bg-base-200 rounded-lg">
									<Shield className="w-5 h-5 text-accent" />
									<div>
										<div className="font-medium text-sm">安全性</div>
										<div className="text-xs text-base-content/70">
											Google認証による保護
										</div>
									</div>
								</div>
							</div>

							{/* ログインボタン */}
							<button
								onClick={loginWithGoogle}
								className="btn btn-primary w-full gap-2"
								type="button"
							>
								<svg className="w-5 h-5" viewBox="0 0 24 24">
									<title>Google</title>
									<path
										fill="currentColor"
										d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
									/>
									<path
										fill="currentColor"
										d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
									/>
									<path
										fill="currentColor"
										d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
									/>
									<path
										fill="currentColor"
										d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
									/>
								</svg>
								Googleでログイン
							</button>

							<div className="text-center mt-4">
								<p className="text-xs text-base-content/50">
									ログインすることで、サービスの利用規約に同意したものとみなします
								</p>
							</div>
						</div>
					</div>

					{/* 使用シーン */}
					<div className="mt-8 text-center">
						<p className="text-sm text-base-content/70 mb-4">
							こんな時に便利です
						</p>
						<div className="grid grid-cols-2 gap-3 text-xs">
							<div className="bg-base-100/50 backdrop-blur-sm p-3 rounded-lg">
								<div className="font-medium">📱 現場確認</div>
								<div className="text-base-content/60">貸出時の保険チェック</div>
							</div>
							<div className="bg-base-100/50 backdrop-blur-sm p-3 rounded-lg">
								<div className="font-medium">📊 一括確認</div>
								<div className="text-base-content/60">複数台の状況確認</div>
							</div>
						</div>
					</div>
				</div>
			</main>
		</div>
	);
};
