import type { Quote, ExecutionRequest } from '../types';
import type { SdkService } from './sdk.service';

export function createQuoteService(sdkService: SdkService): QuoteService {
	let interval: NodeJS.Timer | undefined;

	async function subscribe(callback: (quote: Quote | null, err: any) => void) {
		_refreshQuote(callback);

		if (interval) {
			clearInterval(interval);
		}

		interval = setInterval(() => _refreshQuote(callback), 10000);
	}

	function unsubscribe() {
		clearInterval(interval);
		interval = undefined;
	}

	async function _refreshQuote(callback: (quote: Quote | null, err: any) => void) {
		try {
			const quote = await sdkService.getQuote();
			callback(quote, null);
		} catch (err: any) {
			console.debug('-- refresh quote error --', err);
			callback(null, err);
		}
	}

	return {
		subscribe,
		unsubscribe
	};
}

export interface QuoteService {
	subscribe: (callback: (quote: Quote | null, err: any) => void) => Promise<void>;
	unsubscribe: () => void;
}
