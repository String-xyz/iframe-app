import { writable, type Writable } from 'svelte/store';

export const isAuthorized: Writable<boolean> = writable(false);
