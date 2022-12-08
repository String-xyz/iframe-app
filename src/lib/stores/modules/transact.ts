import { post } from '$lib/services/api';
import { get as getStore, writable, type Writable } from 'svelte/store';
import type { TransactPayload, TransactionResponse, Card, ContractPayload } from '$lib/types';

export const contractPayload: Writable<ContractPayload> = writable();
export const card: Writable<Card | null> = writable();
export const txURL: Writable<string> = writable();
export const txID: Writable<string> = writable();
export const txURL: Writable<string> = writable();


export const getQuote = async (): Promise<TransactPayload> => {
	const data = JSON.stringify(getStore(contractPayload));
	return await post('quotes', data);
};

export const transact = async (quote: TransactPayload): Promise<TransactionResponse> => {
	quote.cardToken = getStore(card)?.token ?? "";
	return await post('transactions', JSON.stringify(quote));
};