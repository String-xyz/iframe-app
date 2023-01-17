import { writable, type Writable } from 'svelte/store';

export interface UserStore {
	walletAddress: string;
	id?: string;
	email?: string;
	status?: string;
}

export const __user = writable<UserStore>({
	walletAddress: "",
	id: "",
	status: ""
});
