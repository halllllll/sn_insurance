import { type FC, useActionState } from "react";
import { useAuth } from "./AuthProvider";

export const MainApp: FC = () => {
	const { logout, isAuthenticated, user } = useAuth();

	if (!isAuthenticated || !user) {
		console.error("User is not authenticated or user data is missing.");
		return null;
	}

	return (
		<div className="flex flex-col items-center justify-center min-h-screen">
			<h1 className="text-amber-600">Welcome, {user.name}!</h1>
			<img src={user.avatar} alt="User Avatar" className="avatar" />
			<button type="button" onClick={logout} className="btn btn-neutral">
				Logout
			</button>
			{/* 他のアプリケーションコンテンツ */}
		</div>
	);
};
