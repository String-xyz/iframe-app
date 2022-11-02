import { apiKey } from "$lib/stores";
import { get as getStore } from 'svelte/store'

const baseUrl = import.meta.env.VITE_API_BASE_PATH;
const JWT_TOKEN = import.meta.env.VITE_JWT_TOKEN

const getHeaders = () => {
	const headers: HeadersInit = {
		'Content-Type': 'application/json',
		'X-Api-Key': getStore(apiKey),
		'Authorization': `Bearer ${JWT_TOKEN}`
	}

	return headers
}
export const post = async (path: string, body: any = undefined) => {
	try {
		const result = await fetch(`${baseUrl}/${path}`, {
			method: 'POST',
			body: body,
			headers: getHeaders()
		});

		if (result.ok) {
			return result.json();
		} else {
			return { statusCode: result.status };
		}
	} catch (e) {
		return { data: undefined, error: e };
	}
};

export const get = async (path: string, auth = false) => {
	try {
		const result = await fetch(`${baseUrl}/${path}`, {
			headers: auth ? getHeaders() : undefined
		});
		
		if (result.ok) {
			return result.json();
		} else {
			return { statusCode: result.status };
		}
	} catch (e) {
		return { data: undefined, error: e };
	}
};

export const put = async (path: string, body: any = undefined) => {
	try {
		const result = await fetch(`${baseUrl}/${path}`, {
			method: 'PUT',
			body: body,
			headers: getHeaders()
		});
		
		if (result.ok) {
			return result.json();
		} else {
			return { statusCode: result.status };
		}
	} catch (e) {
		return { data: undefined, error: e };
	}
};

export const getStatus = async () => {
	const result = await get('healthcheck');
	const APIError = result?.statusCode !== undefined;
	
	return { APIError };
};