export * from './analytics.service';
export * from './api';
import { createApiClient } from './apiClient';
import { createQuoteService } from './quote.service';

// TODO: Set api key from an svelte component
const apiKey = 'str.c74218176b3f4d0599fd2fd3d6dc7213';

export const apiClient = createApiClient({ apiKey });
export const quoteService = createQuoteService(apiClient);
