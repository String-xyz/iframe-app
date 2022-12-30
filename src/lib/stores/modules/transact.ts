import { post } from '$lib/services/api';
import { get as getStore, writable, type Writable } from 'svelte/store';
import type { TransactPayload, TransactionResponse, Card, ContractPayload } from '$lib/types';

export const contractPayload: Writable<ContractPayload> = writable();
export const card: Writable<Card | null> = writable();
export const txID: Writable<string> = writable();
export const txURL: Writable<string> = writable();
