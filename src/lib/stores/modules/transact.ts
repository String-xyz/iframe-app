import { writable, type Writable } from 'svelte/store';
import type { Card, TransactionResponse } from '$lib/types';

export const card: Writable<Card | null> = writable();
export const txResponse: Writable<TransactionResponse> = writable();