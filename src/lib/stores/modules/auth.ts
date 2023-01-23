import { writable } from 'svelte/store';
import type { UserStore } from '$lib/types';

export const __user = writable<UserStore>({
	walletAddress: "",
	id: "",
	status: ""
});
