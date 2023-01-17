import type { TransactPayload, TransactionResponse } from '$lib/types';
import { Events, sendEvent, promisifyEvent } from '../events';

export function createSdkService(): SdkService {

	async function requestAuthorization(walletAddress: string) {
		sendEvent(Events.REQUEST_AUTHORIZE_USER, { walletAddress });
		return promisifyEvent<{ user: User }>(Events.RECEIVE_AUTHORIZE_USER, { timeout: 120 }); // wait 2 minutes for user to authorize
	}

	async function retryLogin() {
		sendEvent(Events.REQUEST_RETRY_LOGIN);
		return promisifyEvent<{ user: User }>(Events.RECEIVE_RETRY_LOGIN);
	}

	async function requestEmailVerification(userId: string, email: string) {
		sendEvent(Events.REQUEST_EMAIL_VERIFICATION, { userId, email });
		return promisifyEvent<void>(Events.RECEIVE_EMAIL_VERIFICATION, { timeout: 20 }); // wait 15 minutes for user to verify email
	}

	async function requestQuoteStart() {
		sendEvent(Events.REQUEST_QUOTE_START, {});
	}

	async function requestQuoteStop() {
		sendEvent(Events.REQUEST_QUOTE_STOP, {});
	}

	async function transact(payload: TransactPayload) {
		sendEvent(Events.REQUEST_CONFIRM_TRANSACTION, payload);
		return promisifyEvent<TransactionResponse>(Events.RECEIVE_CONFIRM_TRANSACTION);
	}


	return {
		requestAuthorization,
		retryLogin,
		requestEmailVerification,
		requestQuoteStart,
		requestQuoteStop,
		transact
	};
}

interface SdkService {
	requestAuthorization: (walletAddress: string) => Promise<{ user: User }>;
	retryLogin: () => Promise<{ user: User }>;
	requestEmailVerification: (userId: string, email: string) => Promise<void>;
	requestQuoteStart: () => Promise<void>;
	requestQuoteStop: () => Promise<void>;
	transact: (payload: TransactPayload) => Promise<TransactionResponse>;
}

export interface User {
	id: string;
	firstName: string;
	middleName: string;
	lastName: string;
	status: string;
	type: string;
	tags: object;
	createdAt: string;
	updateAt: string;
}