import { pb } from "./pocketbase";

// pbをエクスポート
export { pb };

// 認証関連のAPI関数
export const authApi = {
	// Google OAuth認証
	async loginWithGoogle() {
		return await pb.collection("users").authWithOAuth2({ provider: "google" });
	},

	// ログアウト
	logout() {
		pb.authStore.clear();
	},

	// 現在のユーザー取得
	getCurrentUser() {
		return pb.authStore.model;
	},

	// 認証状態確認
	isAuthenticated() {
		return pb.authStore.isValid;
	},

	// トークンリフレッシュ
	async refresh() {
		return await pb.collection("users").authRefresh();
	},
};
