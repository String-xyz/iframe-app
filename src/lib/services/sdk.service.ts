import type { ContractPayload, TransactionResponse } from '$lib/types';
import { Events, sendEvent, promisifyEvent } from '../events';

export function createSdkService(): SdkService {

	async function requestAuthorization(walletAddress: string) {
		console.log('3. authorizeWallet');
		sendEvent(Events.REQUEST_AUTHORIZE_USER, { walletAddress });
		console.log('5. authorizeWallet');
		return promisifyEvent<{ user: User }>(Events.RECEIVE_AUTHORIZE_USER, { timeout: 60000 });
	}

	async function retryLogin() {
		sendEvent(Events.REQUEST_RETRY_LOGIN);
		return promisifyEvent<{ user: User }>(Events.RECEIVE_RETRY_LOGIN);
	}

	async function requestEmailVerification(userId: string, email: string) {
		sendEvent(Events.REQUEST_EMAIL_VERIFICATION, { userId, email });
		return promisifyEvent<void>(Events.RECEIVE_EMAIL_VERIFICATION);
	}

	async function transact(payload: ContractPayload) {
		sendEvent(Events.REQUEST_CONFIRM_TRANSACTION, { payload });
		return promisifyEvent<TransactionResponse>(Events.RECEIVE_CONFIRM_TRANSACTION);
	}

	return {
		requestAuthorization,
		retryLogin,
		requestEmailVerification,
		transact
	};
}

interface SdkService {
	requestAuthorization: (walletAddress: string) => Promise<{ user: User }>;
	retryLogin: () => Promise<{ user: User }>;
	requestEmailVerification: (userId: string, email: string) => Promise<void>;
	transact: (payload: ContractPayload) => Promise<TransactionResponse>;
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