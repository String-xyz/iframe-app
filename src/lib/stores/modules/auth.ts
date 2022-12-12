import { writable, type Writable } from 'svelte/store';
// import { post } from '$lib/services/api';

export const isAuthorized: Writable<boolean> = writable(false);
export const API_KEY: Writable<string> = writable("");
export const JWT_TOKEN: Writable<string> = writable("");

const TEST_JWT_TOKEN = import.meta.env.VITE_TEST_JWT_TOKEN
const ENV = import.meta.env.VITE_ENV

export const login = async () => {
	try {
		if (ENV === 'dev' && TEST_JWT_TOKEN) {
			JWT_TOKEN.set(TEST_JWT_TOKEN)
		} else {
			// Login
		}
	} catch (e) {
		console.error("Could not login ")
	}
}
