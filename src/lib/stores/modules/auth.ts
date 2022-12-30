import { writable, type Writable } from 'svelte/store';
import { browser } from "$app/environment";

export const email: Writable<string> = writable("");
export const userId: Writable<string> = writable("");

export const userStore = {
	userId,
	email
};

// Make sure we only run this code on the browser
if (browser) {
	const getI = (key: string) => localStorage.getItem(key);

	// set initial values from localStorage
	userId.set(getI("userId") || "");
	email.set(getI("email") || "");

	// Save svelte store to localStore every time it changes
	userId.subscribe
		(value => localStorage.setItem("userId", value));
	email.subscribe
		(value => localStorage.setItem("email", value));
}