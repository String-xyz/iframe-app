import { writable } from 'svelte/store';
import type { User } from '$lib/types';

export const __user = writable<User>({
	walletAddress: "",
	id: "",
	status: "",
	email: "",
});

export const userEmailPreview = writable("");