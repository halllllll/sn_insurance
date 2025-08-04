import { Shield } from "lucide-react";
import type { FC } from "react";
import { useAuth } from "./AuthProvider";

interface AppHeaderProps {
	showUserInfo?: boolean;
}

export const AppHeader: FC<AppHeaderProps> = ({ showUserInfo = false }) => {
	const { user, logout } = useAuth();

	return (
		<header className="bg-base-100/80 backdrop-blur-sm shadow-sm">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
				<div className="flex items-center justify-between">
					<div className="flex items-center">
						<Shield className="h-8 w-8 text-primary mr-3" />
						<h1 className="text-xl font-semibold text-base-content">
							端末保険状況確認システム
						</h1>
					</div>

					{showUserInfo && user && (
						<div className="flex items-center gap-4">
							<span className="text-sm text-base-content/70">
								{user.name || user.email}
							</span>
							<button
								type="button"
								onClick={logout}
								className="btn btn-ghost btn-sm"
							>
								ログアウト
							</button>
						</div>
					)}
				</div>
			</div>
		</header>
	);
};
