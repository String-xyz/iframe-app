import { writable, type Writable } from 'svelte/store';

export const modalManager: Writable<any> = writable();
export const modalProps: Writable<any> = writable({});
