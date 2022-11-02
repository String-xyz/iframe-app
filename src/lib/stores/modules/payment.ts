import { post } from '$lib/services/api';
import { get as getStore, writable, type Writable } from 'svelte/store';
import type { TransactPayload, Card, ContractPayload } from '$lib/types';

export const contractPayload: Writable<ContractPayload> = writable();
export const card: Writable<Card> = writable();

export const getQuote = async (): Promise<TransactPayload> => {
	const data = JSON.stringify(getStore(contractPayload));
	return (await post('transact/quote', data)) as TransactPayload;
};

export const transact = async (quote: TransactPayload): Promise<any> => {
	quote.cardToken = getStore(card).token;
	return await post('transact', JSON.stringify(quote));
};