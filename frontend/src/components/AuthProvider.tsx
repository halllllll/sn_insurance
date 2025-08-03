import type { ReactNode } from "react";
import React, { createContext, useContext, useEffect } from "react";
import { authApi } from "../lib/api";
import type { User } from "../lib/pocketbase";
import { pb } from "../lib/pocketbase";

// import { useToast } from "./ToastProvider";

interface AuthContextType {
	user: User | null;
	isAuthenticated: boolean;
	loginWithGoogle: () => Promise<void>;
	logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
	const context = useContext(AuthContext);
	if (!context) {
		throw new Error("useAuth must be used within an AuthProvider");
	}
	return context;
};

interface AuthProviderProps {
	children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
	const [user, setUser] = React.useState<User | null>(
		authApi.getCurrentUser() as User | null,
	);

	// 認証状態の監視とトークンの有効性チェック
	useEffect(() => {
		console.log("🔐 AuthProvider初期化開始");

		// PocketBaseの認証状態変更を監視
		const unsubscribe = pb.authStore.onChange((token, model) => {
			console.log("🔐 認証状態変更:", {
				isValid: pb.authStore.isValid,
				hasToken: !!token,
				hasUser: !!model,
			});

			if (pb.authStore.isValid && model) {
				setUser(model as unknown as User);
			} else {
				console.warn("🔐 認証情報なし - ログアウト処理実行");
				setUser(null);
			}
		});

		// 初期チェック: トークンが有効かどうか確認
		const checkAuth = async () => {
			if (pb.authStore.isValid) {
				try {
					// トークンを使って認証状態を検証
					await authApi.refresh();
					setUser(pb.authStore.model as unknown as User);
					console.log("✅ 認証状態確認完了");
				} catch (error) {
					console.warn(
						"🔐 トークンリフレッシュ失敗 - ログアウト処理実行:",
						error,
					);
					// トークンが無効な場合はクリア
					authApi.logout();
					setUser(null);
					// showWarning("セッションが期限切れです。再ログインしてください。");
				}
			} else {
				console.log("🔐 認証情報なし");
				setUser(null);
			}
		};

		// ローカルストレージの変更を監視（別タブでの変更も検知）
		const handleStorageChange = (e: StorageEvent) => {
			if (e.key === "pocketbase_auth" && e.newValue === null) {
				console.warn("🔐 ローカルストレージから認証情報が削除されました");
				authApi.logout();
				setUser(null);
				// showWarning("認証情報が削除されました。再ログインしてください。");
			}
		};

		// 定期的な認証チェック（5分間隔）
		const authCheckInterval = setInterval(
			async () => {
				if (pb.authStore.isValid) {
					try {
						await authApi.refresh();
						console.log("🔐 定期認証チェック: OK");
					} catch (error) {
						console.warn("🔐 定期認証チェック失敗 - ログアウト:", error);
						authApi.logout();
						setUser(null);
						// showError("認証エラーが発生しました。再ログインしてください。");
					}
				}
			},
			5 * 60 * 1000,
		); // 5分間隔

		checkAuth();
		window.addEventListener("storage", handleStorageChange);

		return () => {
			unsubscribe();
			window.removeEventListener("storage", handleStorageChange);
			clearInterval(authCheckInterval);
		};
	}, []);

	const loginWithGoogle = async () => {
		try {
			const authData = await authApi.loginWithGoogle();
			console.log("✅ Google OAuth成功:", authData.record.name);
			setUser(authData.record as unknown as User);
		} catch (error) {
			console.error("❌ Google OAuth エラー:", error);
			throw error;
		}
	};

	const logout = () => {
		console.log("👋 ログアウト実行");
		authApi.logout();
		setUser(null);
	};

	const value: AuthContextType = {
		user,
		isAuthenticated: !!user,
		loginWithGoogle,
		logout,
	};

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
