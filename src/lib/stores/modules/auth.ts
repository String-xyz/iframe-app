import { writable, type Writable } from 'svelte/store';
import { browser } from "$app/environment";

export const email: Writable<string> = writable("");
export const userId: Writable<string> = writable("");
export const accessToken: Writable<string> = writable("");
export const refreshToken: Writable<string> = writable("");
export const apiKey: Writable<string> = writable("");
export const userStatus: Writable<string> = writable("");

export const userStore = {
	apiKey,
	accessToken,
	userId,
	email,
	refreshToken
};

// Make sure we only run this code on the browser
if (browser) {
	const getI = (key: string) => localStorage.getItem(key);

	// set initial values from localStorage
	apiKey.set(getI("apiKey") || "");
	accessToken.set(getI("accessToken") || "");
	userId.set(getI("userId") || "");
	email.set(getI("email") || "");
	refreshToken.set(getI("refreshToken") || "");

	// Save svelte store to localStore every time it changes
	apiKey.subscribe
		(value => { localStorage.setItem("apiKey", value) });
	accessToken.subscribe
		(value => localStorage.setItem("accessToken", value));
	userId.subscribe
		(value => localStorage.setItem("userId", value));
	email.subscribe
		(value => localStorage.setItem("email", value));
	refreshToken.subscribe
		(value => localStorage.setItem("refreshToken", value));
}