import { sendEvent, Events, promisifyEvent } from '$lib/events';
import type { TransactPayload, TransactionResponse, ContractPayload, Quote } from '$lib/types';

export function createApiClient(): ApiClient {
	let _walletAddress = '';
	// this is not ideal, temporary solution until we migrate this file to the sdk
	function setWalletAddress(address: string) {
		_walletAddress = address;
	}

	async function requestLogin(walletAddress: string) {
		// send request event to parent
		sendEvent(Events.REQUEST_LOGIN, { walletAddress });

		return promisifyEvent<{ nonce: string }>(Events.RECEIVE_LOGIN);
	}

	async function requestSignature(nonce: string) {
		sendEvent(Events.REQUEST_SIGNATURE, { nonce });

		return promisifyEvent<{ signature: string }>(Events.RECEIVE_SIGNATURE);
	}

	async function createUser(nonce: string, signature: string, visitor: VisitorData) {
		const body = {
			nonce,
			signature,
			fingerprint: visitor
		};

		sendEvent(Events.REQUEST_CREATE_USER, body);

		return promisifyEvent<{ authToken: AuthToken, user: User }>(Events.RECEIVE_CREATE_USER);
	}

	async function updateUser(userId: string, update: UserUpdate) {
		const body = { update };
		sendEvent(Events.REQUEST_UPDATE, body);

		return promisifyEvent<User>(Events.RECEIVE_UPDATE);
	}

	async function requestEmailVerification(userId: string, email: string) {
		const body = { email };
		sendEvent(Events.REQUEST_EMAIL_VERIFICATION, body);

		return promisifyEvent<void>(Events.REQUEST_EMAIL_VERIFICATION);
	}

	async function loginUser(nonce: string, signature: string, visitor: VisitorData) {
		const body = {
			nonce,
			signature,
			fingerprint: visitor
		};

		sendEvent(Events.REQUEST_LOGIN, body);

		return promisifyEvent<{ authToken: AuthToken, user: User }>(Events.RECEIVE_LOGIN);
	}

	async function refreshToken() {
		sendEvent(Events.REQUEST_REFRESH_TOKEN);

		return promisifyEvent<AuthToken>(Events.REQUEST_REFRESH_TOKEN);
	}

	async function logoutUser() {
		sendEvent(Events.REQUEST_LOGIN);

		return promisifyEvent<void>(Events.REQUEST_LOGIN);
	}


	async function getUserStatus(userId: string) {
		sendEvent(Events.REQUEST_USER_STATUS, { userId });

		return promisifyEvent<{ status: string }>(Events.RECEIVE_USER_STATUS);
	}

	async function getQuote(contractPayload: ContractPayload) {
		sendEvent(Events.REQUEST_QUOTE, contractPayload);

		return promisifyEvent<TransactPayload>(Events.RECEIVE_QUOTE);
	};

	async function transact(transactPayload: TransactPayload) {
		sendEvent(Events.LOAD_PAYLOAD, transactPayload);

		return promisifyEvent<TransactionResponse>(Events.LOAD_PAYLOAD);
	}

	// function _getErrorFromAxiosError(e: any) {
	// 	if (e.response) return e.response.data;
	// 	else if (e.request) return e.request;
	// 	else return e.message;
	// }

	// // TODO: Create a Request interceptor to add the X-Api-Key header to every request
	// // httpClient.interceptors.request.use(
	// // 	async (config: any) => {
	// // 		if (!_apiKey) {
	// // 			console.error('---- 1 ::::::: No API key set');
	// // 			return Promise.reject('No API key set');
	// // 		}

	// // 		config.headers['X-Api-Key'] = _apiKey;
	// // 		return config;
	// // 	},
	// // 	error => {
	// // 		console.error('---- 2 ::::::: No API key set');
	// // 		return Promise.reject(error);
	// // 	}
	// // );

	// // Response interceptor to refresh the access token. Every time a request is made, the interceptor will check if the access token is expired.
	// // If it is, it will try to refresh the token, and then retry the original request.
	// httpClient.interceptors.response.use(
	// 	response => response,
	// 	async error => {
	// 		// TODO: once this is migrated to the sdk, make sure there is a wallet connection before refreshing the token
	// 		if (!error.response || !error.response.data) return Promise.reject(error);

	// 		if (error.response.status === 401 && error.response.data?.code === 'TOKEN_EXPIRED' || error.response.data?.code === 'MISSING_TOKEN') {
	// 			console.log('------- refreshing token....')
	// 			const originalRequest = error.config;
	// 			try {
	// 				const data = await refreshToken();

	// 				// update the access token in the userStore
	// 				// retry the original request with the new access token
	// 				originalRequest.headers['Authorization'] = `Bearer ${data.token}`;
	// 				return httpClient(originalRequest);
	// 			} catch (e: any) {
	// 				console.error("refresh token error:", _getErrorFromAxiosError(e));
	// 				// TODO: logout user. For now, just throw the error
	// 				return Promise.reject(error);
	// 			}
	// 		}

	// 		return Promise.reject(error);
	// 	});

	return {
		requestLogin,
		requestSignature,
		createUser,
		updateUser,
		requestEmailVerification,
		loginUser,
		refreshToken,
		logoutUser,
		getUserStatus,
		getQuote,
		transact,
		setWalletAddress,
	};
}

interface ApiKeyResponse {
	id: string;
	status: string;
	authType: string;
	data: string;
	createdAt: string;
	updatedAt: string;
}

interface RefreshToken {
	token: string;
	expAt: Date;
}

interface AuthToken {
	token: string;
	refreshToken: RefreshToken;
	issuedAt: string;
	expAt: string;
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

export interface VisitorData {
	visitorId?: string;
	requestId?: string;
}

export interface ApiClient {
	requestLogin: (walletAddress: string) => Promise<{ nonce: string }>;
	requestSignature: (nonce: string) => Promise<{ signature: string }>;
	createUser: (nonce: string, signature: string, visitor: VisitorData) => Promise<{ authToken: AuthToken, user: User }>;
	loginUser: (nonce: string, signature: string, visitor: VisitorData) => Promise<{ authToken: AuthToken, user: User }>;
	refreshToken: () => Promise<AuthToken>;
	updateUser: (userId: string, userUpdate: UserUpdate) => Promise<User>;
	requestEmailVerification: (userId: string, email: string) => Promise<void>;
	logoutUser: () => Promise<void>;
	getUserStatus: (userId: string) => Promise<{ status: string }>;
	getQuote: (contractPayload: ContractPayload) => Promise<TransactPayload>;
	transact: (quote: TransactPayload) => Promise<TransactionResponse>;
	setWalletAddress: (walletAddress: string) => void;
}