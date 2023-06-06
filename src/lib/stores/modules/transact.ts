import { writable, type Writable } from 'svelte/store';
import type { Card, TransactionResponse } from '$lib/types';

export const cards: Writable<Card[]> = writable([
	{
		cardId: "src_m33bdwlpwh7ezlq5fxklbchirm",
		scheme: "VISA",
		last4: "4242",
		expiryMonth: 10,
		expiryYear: 2025,
		expired: false,
		isSavedCard: true,
		shouldSaveCard: false
    }
]);
export const selectedCard: Writable<Card | null> = writable();
export const txResponse: Writable<TransactionResponse> = writable();