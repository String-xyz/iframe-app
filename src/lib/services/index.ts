export * from './analytics.service';
import { createApiClient } from './apiClient';
import { createQuoteService } from './quote.service';
import { createWalletService } from './wallet.service';

export const apiClient = createApiClient();
export const quoteService = createQuoteService(apiClient);
export const walletService = createWalletService();