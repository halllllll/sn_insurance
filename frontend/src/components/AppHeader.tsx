import { Shield } from "lucide-react";
import type { FC } from "react";
import { useOrganizationSettings } from "../hooks/useOrganizationSettings";
import { useAuth } from "./AuthProvider";

interface AppHeaderProps {
	showUserInfo?: boolean;
}

export const AppHeader: FC<AppHeaderProps> = ({ showUserInfo = false }) => {
	const { user, logout } = useAuth();
	const { settings } = useOrganizationSettings();

	return (
		<header className="bg-base-100/80 backdrop-blur-sm shadow-sm">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
				<div className="flex items-center justify-between">
					<div className="flex items-center">
						<Shield className="h-8 w-8 text-primary mr-3" />
						<h1 className="text-xl font-semibold text-base-content">
							{settings.organization_name}
							{settings.app_title}
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
