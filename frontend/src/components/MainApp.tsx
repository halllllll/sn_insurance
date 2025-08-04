import type { FC } from "react";
import { AppHeader } from "./AppHeader";
import { SearchForm } from "./search/SearchForm";

export const MainApp: FC = () => {
	return (
		<div className="flex-1 bg-base-200">
			<AppHeader showUserInfo={true} />

			{/* メインコンテンツ */}
			<main className="min-h-[calc(100vh-theme(spacing.16))] py-6">
				<SearchForm />
			</main>
		</div>
	);
};
