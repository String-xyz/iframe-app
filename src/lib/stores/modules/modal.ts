import { writable, type Writable } from 'svelte/store';
import type { NFT } from '$lib/types';

export const modalManager: Writable<any> = writable();
export const item: Writable<NFT> = writable();
