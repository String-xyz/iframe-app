export * from './analytics.service';
import { createApiClient } from './apiClient';
import { createQuoteService } from './quote.service';

export const apiClient = createApiClient();
export const quoteService = createQuoteService(apiClient);
