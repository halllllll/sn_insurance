import useSWR from "swr";
import { pb } from "../lib/pocketbase";
import type { SerialNumber } from "../types/serial_number";

export interface SearchResult {
	serial_number: string;
	is_insurance: boolean;
	found: boolean;
	error?: string;
}

// シリアルナンバーの検索（単体・複数対応）
export function useSerialNumberSearch(serialNumbers: string[]) {
	const { data, error, isLoading, mutate } = useSWR(
		serialNumbers.length > 0 ? ["search-serial-numbers", serialNumbers] : null,
		async () => {
			const results: SearchResult[] = [];

			for (const sn of serialNumbers) {
				try {
					const trimmedSn = sn.trim();
					if (!trimmedSn) continue;

					const records = await pb
						.collection("serial_numbers")
						.getList<SerialNumber>(1, 1, {
							filter: `serial_number = "${trimmedSn}"`,
						});

					if (records.items.length > 0) {
						const record = records.items[0];
						results.push({
							serial_number: trimmedSn,
							is_insurance: record.is_insurance,
							found: true,
						});
					} else {
						results.push({
							serial_number: trimmedSn,
							is_insurance: false,
							found: false,
						});
					}
				} catch (err) {
					results.push({
						serial_number: sn.trim(),
						is_insurance: false,
						found: false,
						error: err instanceof Error ? err.message : "検索エラー",
					});
				}
			}

			return results;
		},
		{
			revalidateOnFocus: false,
			revalidateOnReconnect: false,
		},
	);

	return {
		results: data || [],
		error: error?.message,
		isLoading,
		search: mutate,
	};
}

// リアルタイム検索（部分一致）
export function useRealtimeSearch(query: string, enabled: boolean = true) {
	const { data, error, isLoading } = useSWR(
		enabled && query.length >= 2 ? ["realtime-search", query] : null,
		async () => {
			const records = await pb
				.collection("serial_numbers")
				.getList<SerialNumber>(1, 10, {
					filter: `serial_number ~ "${query}"`,
					sort: "serial_number",
				});

			return records.items.map((item) => ({
				serial_number: item.serial_number,
				is_insurance: item.is_insurance,
			}));
		},
		{
			revalidateOnFocus: false,
			dedupingInterval: 300, // 300ms間隔でリクエストを制限
		},
	);

	return {
		suggestions: data || [],
		error: error?.message,
		isLoading,
	};
}
