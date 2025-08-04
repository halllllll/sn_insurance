import useSWR from "swr";
import { pb } from "../lib/pocketbase";

export interface OrganizationSettings {
	id: string;
	app_title: string;
	organization_name: string;
	contact_email?: string;
	app_description?: string;
	maintenance_mode?: boolean;
	maintenance_message?: string;
}

async function fetchOrganizationSettings(): Promise<OrganizationSettings | null> {
	try {
		// 設定は1件のみ存在することを想定
		const result = await pb
			.collection("organization_settings")
			.getFirstListItem<OrganizationSettings>("");
		return result;
	} catch (error) {
		console.warn(
			"組織設定が見つかりません。デフォルト設定を使用します。",
			error,
		);
		return null;
	}
}

export function useOrganizationSettings() {
	const { data, error, isLoading, mutate } = useSWR(
		"organization_settings",
		fetchOrganizationSettings,
		{
			revalidateOnFocus: false,
			revalidateOnReconnect: false,
			// 設定は頻繁に変わらないので、長めのキャッシュ時間
			dedupingInterval: 300000, // 5分
		},
	);

	// デフォルト値
	const defaultSettings: Omit<OrganizationSettings, "id"> = {
		app_title: "端末保険状況確認",
		organization_name: "",
	};

	return {
		settings: data || defaultSettings,
		error: error?.message,
		isLoading,
		refresh: mutate,
	};
}
