import { FileText, Search, Shield } from "lucide-react";
import { type FC, useActionState } from "react";
import { useAuth } from "./AuthProvider";

export const LoginForm: FC = () => {
	const { loginWithGoogle } = useAuth();
	const [_, formAction, isPending] = useActionState(loginWithGoogle, null);

	return (
		<div className="">
			{/* ヘッダー */}
			<header className="bg-white shadow-sm">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
					<div className="flex items-center">
						<Shield className="h-8 w-8 text-blue-600 mr-3" />
						<h1 className="text-xl font-semibold text-gray-900">
							保険状況確認システム
						</h1>
					</div>
				</div>
			</header>

			{/* メインコンテンツ */}
			<main className="flex-1 flex items-center justify-center p-4 pt-16">
				<div className="w-full max-w-md">
					<div className="bg-white rounded-lg shadow-lg p-8">
						<div className="text-center mb-8">
							<div className="mx-auto w-16 h-16  rounded-full flex items-center justify-center mb-4">
								<Search className="h-8 w-8 text-blue-600" />
							</div>
							<h2 className="text-2xl font-bold text-gray-900 mb-2">
								端末保険確認
							</h2>
							<p className="text-gray-600">
								貸出端末のシリアル番号から
								<br />
								保険の有無を素早く確認できます
							</p>
						</div>

						{isPending ? (
							<div className="text-center">
								<span className="loading loading-spinner loading-lg text-blue-600"></span>
								<p className="mt-4 text-gray-600">認証中...</p>
							</div>
						) : (
							<form className="space-y-6">
								<button
									className="btn bg-white text-black border-[#e5e5e5] w-full"
									type="submit"
									formAction={formAction}
									disabled={isPending}
								>
									<svg
										aria-label="Google logo"
										width="16"
										height="16"
										xmlns="http://www.w3.org/2000/svg"
										viewBox="0 0 512 512"
									>
										<g>
											<title>Google Logo</title>
											<path d="m0 0H512V512H0" fill="#fff"></path>
											<path
												fill="#34a853"
												d="M153 292c30 82 118 95 171 60h62v48A192 192 0 0190 341"
											></path>
											<path
												fill="#4285f4"
												d="m386 400a140 175 0 0053-179H260v74h102q-7 37-38 57"
											></path>
											<path
												fill="#fbbc02"
												d="m90 341a208 200 0 010-171l63 49q-12 37 0 73"
											></path>
											<path
												fill="#ea4335"
												d="m153 219c22-69 116-109 179-50l55-54c-78-75-230-72-297 55"
											></path>
										</g>
									</svg>
									Googleアカウントでログイン
								</button>
							</form>
						)}

						{/* 機能説明 */}
						<div className="mt-8 pt-6 border-t border-gray-200">
							<h3 className="text-sm font-medium text-gray-900 mb-3">
								主な機能
							</h3>
							<div className="space-y-2 text-sm text-gray-600">
								<div className="flex items-center">
									<Search className="h-4 w-4 mr-2 text-gray-400" />
									<span>シリアル番号での高速検索</span>
								</div>
								<div className="flex items-center">
									<FileText className="h-4 w-4 mr-2 text-gray-400" />
									<span>複数台の一括確認</span>
								</div>
								<div className="flex items-center">
									<Shield className="h-4 w-4 mr-2 text-gray-400" />
									<span>保険状況の即座表示</span>
								</div>
							</div>
						</div>
					</div>
				</div>
			</main>
		</div>
	);
};
