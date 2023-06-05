import type { SavedCard, TransactionRequest, TransactionResponse } from '$lib/types';
import { Events, sendEvent, promisifyEvent } from '../events';

export function createSdkService(): SdkService {

	async function requestAuthorization(walletAddress: string) {
		sendEvent(Events.REQUEST_AUTHORIZE_USER, { walletAddress });
		return promisifyEvent<{ user: User }>(Events.RECEIVE_AUTHORIZE_USER, { timeout: 5 * 60 }); // wait 5 minutes for user to authorize
	}

	async function requestEmailVerification(userId: string, email: string) {
		sendEvent(Events.REQUEST_EMAIL_VERIFICATION, { userId, email });
		return promisifyEvent<{ status: string }>(Events.RECEIVE_EMAIL_VERIFICATION, { timeout: 15 * 60 }); // wait 15 minutes for user to verify email
	}

	async function requestDeviceVerification(walletAddress: string) {
		sendEvent(Events.REQUEST_DEVICE_VERIFICATION, { walletAddress });
		return promisifyEvent<{ status: string }>(Events.RECEIVE_DEVICE_VERIFICATION, { timeout: 15 * 60 }); // wait 15 minutes for user to verify email
	}

	async function getUserEmailPreview(walletAddress: string) {
		sendEvent(Events.REQUEST_EMAIL_PREVIEW, { walletAddress });
		return promisifyEvent<{ email: string }>(Events.RECEIVE_EMAIL_PREVIEW);
	}

	async function updateUserName(userId: string, update: UserUpdate) {
		sendEvent(Events.REQUEST_UPDATE_USER, { userId, update });
	}

	async function requestQuoteStart() {
		console.debug("✅ Quote started");
		sendEvent(Events.REQUEST_QUOTE_START, {});
	}

	async function requestQuoteStop() {
		console.debug("❌ Quote stopped");
		sendEvent(Events.REQUEST_QUOTE_STOP, {});
	}

	async function requestSavedCards() {
		sendEvent(Events.REQUEST_SAVED_CARDS, {});
		return promisifyEvent<{ cards: SavedCard[] }>(Events.RECEIVE_SAVED_CARDS);
	}

	async function transact(payload: TransactionRequest) {
		sendEvent(Events.REQUEST_CONFIRM_TRANSACTION, payload);
		return promisifyEvent<TransactionResponse>(Events.RECEIVE_CONFIRM_TRANSACTION);
	}

	return {
		requestAuthorization,
		requestEmailVerification,
		requestDeviceVerification,
		getUserEmailPreview,
		updateUserName,
		requestQuoteStart,
		requestQuoteStop,
		requestSavedCards,
		transact
	};
}

interface SdkService {
	requestAuthorization: (walletAddress: string) => Promise<{ user: User }>;
	getUserEmailPreview: (walletAddress: string) => Promise<{ email: string }>;
	updateUserName: (userId: string, update: UserUpdate) => Promise<void>
	requestEmailVerification: (userId: string, email: string) => Promise<{ status: string }>;
	requestDeviceVerification: (walletAddress: string) => Promise<{ status: string }>;
	requestQuoteStart: () => Promise<void>;
	requestQuoteStop: () => Promise<void>;
	requestSavedCards: () => Promise<{ cards: SavedCard[] }>;
	transact: (payload: TransactionRequest) => Promise<TransactionResponse>;
}

interface UserUpdate {
	walletAddress?: string;
	firstName?: string;
	middleName?: string;
	lastName?: string;
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