import { type FC, useActionState } from "react";
import { useAuth } from "./AuthProvider";

export const LoginForm: FC = () => {
	const { loginWithGoogle } = useAuth();
	const [_, formAction, isPending] = useActionState(loginWithGoogle, null);

	return (
		<div className="min-h-screen flex flex-col">
			{/* メインコンテンツ */}
			<div className="flex-1 flex items-center justify-center p-4">
				<div className="w-full max-w-sm">
					<div className="text-center mb-6">
						<h1 className="text-2xl font-bold mb-2">シリアル番号管理</h1>
						<p className="text-gray-600">ログインしてください</p>
					</div>

					{isPending ? (
						<div className="text-center">
							<span className="loading loading-spinner loading-lg"></span>
							<p className="mt-2">認証中...</p>
						</div>
					) : (
						<form>
							<button
								type="submit"
								formAction={formAction}
								className="btn btn-primary w-full"
								disabled={isPending}
							>
								Googleでログイン
							</button>
						</form>
					)}
				</div>
			</div>

			{/* フッター */}
			<footer className="p-4 text-center text-sm text-gray-500 border-t">
				© 2025 シリアル番号管理システム
			</footer>
		</div>
	);
};
