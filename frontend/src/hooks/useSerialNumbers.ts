import useSWR from "swr";
import { pb } from "../lib/api";
import type { SerialNumber } from "../types/serial_number";

async function fetchSerialNumbers() {
	try {
		const result = await pb
			.collection("serial_numbers")
			.getFullList<SerialNumber>();
		return result;
	} catch (error) {
		console.error("データ取得エラー:", error);
		throw error;
	}
}

export function useSerialNumbers() {
	const { data, isLoading, error, mutate } = useSWR(
		["seriarl_number"],
		fetchSerialNumbers,
	);

	return {
		data,
		isLoading,
		error,
		mutate,
	};
}
