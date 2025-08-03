import PocketBase from "pocketbase";

// PocketBaseクライアントの初期化
// TODO: モノレポでenvを統一（あるいは統一するよりマシな方法で）、アプリのURLを取得

const getBaseUrl = () => {
	return import.meta.env.DEV
		? "http://localhost:9991"
		: import.meta.env.VITE_AP_URL;
};

export const pb = new PocketBase(getBaseUrl());

// タイプ定義
export interface User {
	id: string;
	email: string;
	name: string;
	avatar?: string;
	created: string;
	updated: string;
}
