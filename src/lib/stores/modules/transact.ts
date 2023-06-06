import { writable, type Writable } from 'svelte/store';
import type { Card, TransactionResponse } from '$lib/types';

export const cardList: Writable<Card[]> = writable([]);
export const selectedCard: Writable<Card | null> = writable();
export const txResponse: Writable<TransactionResponse> = writable();