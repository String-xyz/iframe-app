import { createQuoteService } from './quote.service';
import { createSdkService } from './sdk.service';

export const sdkService = createSdkService();
export const quoteService = createQuoteService(sdkService);
