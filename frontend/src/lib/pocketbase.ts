import PocketBase from "pocketbase";

// PocketBaseクライアントの初期化
// TODO: モノレポでenvを統一（あるいは統一するよりマシな方法で）、アプリのURLを取得
export const pb = new PocketBase("http://localhost:9911");

// タイプ定義
export interface User {
	id: string;
	email: string;
	name: string;
	avatar?: string;
	// role: "admin" | "member";
	created: string;
	updated: string;
}
