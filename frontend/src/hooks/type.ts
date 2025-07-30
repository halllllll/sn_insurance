import type { SerialNumber } from "../types/serial_number";

export interface SerialNumberSuccess {
	page: number;
	perPage: number;
	totalPages: number;
	totalItems: number;
	items: SerialNumber[];
}

export interface SerialNumberFailure {
	status: number;
	message: string;
	data: any;
}
