import { writable, type Writable } from 'svelte/store';
import type { Quote } from '$lib/types';

export const finalQuote: Writable<Quote | null> = writable();
export const quote: Writable<Quote | null> = writable();
