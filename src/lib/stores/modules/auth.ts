import { writable, type Writable } from 'svelte/store';
import { post } from '$lib/services/api';

export const isAuthorized: Writable<boolean> = writable(false);
export const API_KEY: Writable<string> = writable("");
export const JWT_TOKEN: Writable<string> = writable("");

export const login = async (loginType: string, email: string, password: string) => {
	try {
		const data = await post('auth/login', {
			loginType,
			email,
			password
		});
		
		JWT_TOKEN.set(data.token)
		return data
	} catch (e) {
		console.error("Could not login ", email)
	}
}
