import { pb } from "./pocketbase";

// pbをエクスポート
export { pb };

// serial_numbersコレクション取得API

// 認証関連のAPI関数
export const authApi = {
	// Google OAuth認証
	// async/awaitを使うとsafariでバグるらしい?
	// （結局今の設定だとトランスパイルしたらasync/awaitになりそうだけど）
	async loginWithGoogle() {
		try {
			console.log("🐰 OAuth認証を開始します...?");
			console.info("PocketBase URL:", pb.baseURL);

			// // なんかうまくいかない
			// return pb
			// 	.collection("users")
			// 	.authWithOAuth2({
			// 		provider: "google",
			// 		urlCallback: (url) => {
			// 			console.info("🐰 OAuth URL??:", url);
			// 			const adjustUrl = new URL(url);
			// 			adjustUrl.searchParams.set(
			// 				"redirect_uri",
			// 				`${pb.baseURL}/api/oauth2-redirect`,
			// 			);
			// 			console.log("🐸: ", adjustUrl);
			// 			// window.location.href = url;
			// 			window.open(adjustUrl, "_blank");
			// 		},
			// 	})
			// 	.then((resolve) => {
			// 		console.info("俺は何");
			// 		console.log(resolve);
			// 		return resolve;
			// 	})
			// 	.catch((reason) => {
			// 		console.error("だめだ〜");
			// 		console.error(reason);
			// 		throw reason;
			// 	});

			try {
				console.log("🐰 OAuth認証を開始します...");
				console.info("PocketBase URL:", pb.baseURL);

				// まずauth methodsを確認
				const authMethods = await pb.collection("users").listAuthMethods();
				console.log("利用可能な認証方法:", authMethods);
				console.log("OAuth2プロバイダー:", authMethods.oauth2?.providers);

				return pb.collection("users").authWithOAuth2({
					provider: "google",
					// urlCallback: (url) => {
					// 	console.info("🐰 OAuth URL:", url);
					// 	window.open(url, "_blank");
					// },
				});
			} catch (error) {
				console.error("👺 OAuth認証エラー:", error);
				if (error) {
					console.error(error);
				}
				throw error;
			}
		} catch (error) {
			console.error("👺 OAuth認証エラー:", error);
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
