import { writable, type Writable } from 'svelte/store';
import type { Card, ContractPayload } from '$lib/types';

export const contractPayload: Writable<ContractPayload> = writable();
export const card: Writable<Card | null> = writable();
export const txID: Writable<string> = writable();
export const txURL: Writable<string> = writable();
