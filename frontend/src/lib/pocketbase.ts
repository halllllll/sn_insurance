import PocketBase from "pocketbase";

// PocketBaseクライアントの初期化
// TODO: モノレポでenvを統一（あるいは統一するよりマシな方法で）、アプリのURLを取得

const getBaseUrl = () => {
	// 開発環境用のフォールバック
	return "http://localhost:9991";
};

export const pb = new PocketBase(getBaseUrl());

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
