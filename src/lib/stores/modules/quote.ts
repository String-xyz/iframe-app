import { writable, get as getStore, type Writable } from 'svelte/store';
import { getQuote } from '$lib/stores';
import type { TransactPayload } from '$lib/types';

export const finalQuote: Writable<TransactPayload | null> = writable();
export const quote: Writable<TransactPayload | null> = writable();

export const quoteInterval: Writable<NodeJS.Timer> = writable();

export const refreshQuote = async () => {
	const refreshQuote = async () => {
		try {
			quote.set(await getQuote());
		} catch (e) {
			console.error(e);
		}
	};

	await refreshQuote();

	if (getStore(quoteInterval)) {
		clearInterval(getStore(quoteInterval));
	}

	quoteInterval.set(setInterval(refreshQuote, 10000));
};

export const stopQuote = async () => {
	clearInterval(getStore(quoteInterval));
	quote.set(null);
}
