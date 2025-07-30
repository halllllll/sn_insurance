import { useActionState } from "react";
import { pb } from "../lib/api";

interface SerialNumber {
	id: string;
	serial_number: string;
	is_assuarance: boolean;
	created: string;
	updated: string;
}

interface SerialNumbersState {
	data: SerialNumber[] | null;
	error: string | null;
	isInitialLoad: boolean;
}

async function fetchSerialNumbersAction(
	prevState: SerialNumbersState | null,
	_formData: FormData,
): Promise<SerialNumbersState> {
	try {
		// 初回ロードのダミー待機時間
		if (prevState?.isInitialLoad) {
			await new Promise((resolve) => setTimeout(resolve, 1500));
		}

		const sns = await pb
			.collection("serial_numbers")
			.getFullList<SerialNumber>();
		return {
			data: sns,
			error: null,
			isInitialLoad: false,
		};
	} catch (error) {
		console.error("データ取得エラー:", error);
		return {
			data: null,
			error: "データの取得に失敗しました",
			isInitialLoad: false,
		};
	}
}

export function useSerialNumbers() {
	const [state, formAction, isPending] = useActionState(
		fetchSerialNumbersAction,
		{
			data: null,
			error: null,
			isInitialLoad: true,
		},
	);

	// 初回自動実行をsetTimeoutで非同期化
	if (state.isInitialLoad && !isPending) {
		setTimeout(() => {
			const form = new FormData();
			formAction(form);
		}, 0);
	}

	return {
		data: state?.data || null,
		error: state?.error || null,
		isLoading: isPending,
		fetchAction: formAction,
	};
}
