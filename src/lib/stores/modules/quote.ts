import { writable, type Writable } from 'svelte/store';
import type { TransactPayload } from '$lib/types';

export const finalQuote: Writable<TransactPayload | null> = writable();
export const quote: Writable<TransactPayload | null> = writable();
