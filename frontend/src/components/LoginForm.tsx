import { Search } from "lucide-react";
import type { FC } from "react";
import { useOrganizationSettings } from "../hooks/useOrganizationSettings";
import { AppHeader } from "./AppHeader";
import { useAuth } from "./AuthProvider";

export const LoginForm: FC = () => {
	const { loginWithGoogle } = useAuth();
	const { settings } = useOrganizationSettings();

	return (
		<div className="bg-gradient-to-br from-primary/20 to-secondary/20">
			<AppHeader showUserInfo={false} />

			{/* メインコンテンツ */}
			<main className="min-h-[calc(90vh)] flex-1 flex items-center justify-center">
				<div className="w-full max-w-md">
					<div className="card bg-base-100 shadow-xl">
						<div className="card-body">
							<div className="text-center mb-8">
								<div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
									<Search className="h-8 w-8 text-primary" />
								</div>
								<h2 className="text-2xl font-bold text-base-content mb-2">
									{settings.app_title}
								</h2>
								<p className="text-base-content/70">
									シリアルナンバーから保険状況を確認
								</p>
							</div>

							{/* ログインボタン */}
							<button
								onClick={loginWithGoogle}
								className="btn bg-white text-black border-[#e5e5e5] w-full gap-2 h-14"
								type="button"
							>
								{/* <svg className="w-5 h-5" viewBox="0 0 24 24" aria-hidden="true">
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
								</svg> */}
								<svg
									aria-label="Google logo"
									width="16"
									height="16"
									xmlns="http://www.w3.org/2000/svg"
									viewBox="0 0 512 512"
								>
									<title>Login with Google</title>
									<g>
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
								Googleでログイン
							</button>

							<div className="text-center mt-4">
								<p className="text-xs text-base-content/50">
									Google認証を使用してセキュアにログインします
								</p>
							</div>
						</div>
					</div>
				</div>
			</main>
		</div>
	);
};
