import { pb } from "./pocketbase";

// pbをエクスポート
export { pb };

// 認証関連のAPI関数
export const authApi = {
	// Google OAuth認証
	// async/awaitを使うとsafariでバグるらしい?
	// https://github.com/pocketbase/js-sdk/issues/331#issuecomment-2621463867
	async loginWithGoogle() {
		const eagerWindowOpen = window.open("", "_blank");

		try {
			console.log("🐰 OAuth認証を開始します...");
			console.info("PocketBase URL:", pb.baseURL);

			return await pb.collection("users").authWithOAuth2({
				provider: "google",
				urlCallback: (url) => {
					console.info("🐰 OAuth URL:", url);
					// window.open(url, "_blank"); // popupがブロックされてしまう

					const adjustedUrl = new URL(url);

					// クエリを追加
					adjustedUrl.searchParams.set("access_type", "offline");
					adjustedUrl.searchParams.set("prompt", "consent");

					console.log(`url: ${adjustedUrl.toString()}`);

					// 新しいタブで同意画面
					if (eagerWindowOpen) {
						eagerWindowOpen.location.href = adjustedUrl.toString();
					} else {
						throw Error("no window context");
					}
				},
			});
		} catch (error) {
			console.error("👺 OAuth認証エラー:", error);
			if (error) {
				console.error(error);
			}
			eagerWindowOpen?.close();
			throw error;
		}
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
