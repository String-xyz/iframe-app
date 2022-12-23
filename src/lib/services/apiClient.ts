import axios from 'axios';
import { userStore } from '$lib/stores';

// function createApiClient({ axiosInstance }: { axiosInstance: Axios }) {
export function createApiClient() {
	const baseUrl = import.meta.env.VITE_API_BASE_PATH;

	let _apiKey = '';
	let _accessToken = '';

	userStore.apiKey.subscribe((value) => _apiKey = value);
	userStore.accessToken.subscribe((value) => _accessToken = value);

	const commonHeaders: any = {
		'Content-Type': 'application/json',
	}

	const httpClient = axios.create({
		baseURL: baseUrl,
		headers: commonHeaders
	});

	async function createApiKey() {
		const { data } = await httpClient.post<{ apiKey: string }>('/apikeys');
		userStore.apiKey.set(data.apiKey);
		return data;
	}

	async function getApiKeys(limit = 10) {
		const { data } = await httpClient.get<ApiKeyResponse[]>('/apikeys', { params: { limit } });
		return data;
	}

	async function validateApiKey(keyId: string) {
		const { data } = await httpClient.post<{ Status: string }>(`/apikeys/${keyId}/approve`);
		return data;
	}

	async function requestLogin(walletAddress: string) {
		const { data } = await httpClient.get<{ nonce: string }>(`/login`, { params: { walletAddress } });
		return data;
	}

	async function createUser(nonce: string, signature: string, visitor: VisitorData) {
		const headers = { 'X-Api-Key': _apiKey };
		const body = {
			nonce,
			signature,
			fingerprint: visitor
		};

		try {
			const { data } = await httpClient.post<{ authToken: AuthToken, user: User }>(`/users`, body, { headers });
			// set store values
			userStore.accessToken.set(data.authToken?.token);
			userStore.userId.set(data.user.id);
			userStore.userStatus.set(data.user.status);


			return data;
		} catch (e: any) {
			const error = _getErrorFromAxiosError(e);
			console.error("createUser error:", error);
			throw error;
		}
	}

	async function updateUser(userId: string, update: UserUpdate) {
		const { data } = await httpClient.put<User>(`/users/${userId}`, update, {
			headers: { 'X-Api-Key': _apiKey, 'Authorization': `Bearer ${_accessToken}` },
		});
		return data;
	}

	async function requestEmailVerification(userId: string, email: string) {
		await httpClient.get(`/users/${userId}/verify-email`, {
			headers: { 'X-Api-Key': _apiKey, 'Authorization': `Bearer ${_accessToken}` },
			params: { email },
			timeout: 15 * 60 * 1000 // 15 minutes
		});

		return
	}

	async function loginUser(nonce: string, signature: string, visitor: VisitorData) {
		const headers = { 'X-Api-Key': _apiKey };
		const body = {
			nonce,
			signature,
			fingerprint: visitor
		};

		try {
			const { data } = await httpClient.post<{ authToken: AuthToken, user: User }>(`/login/sign`, body, { headers });
			// set the access token in the userStore
			userStore.accessToken.set(data.authToken?.token);
			// set the user id in the userStore
			userStore.userId.set(data.user.id);

			return data;
		} catch (e: any) {
			console.error("createUser error:", _getErrorFromAxiosError(e));
			throw e;
		}
	}

	async function getUserStatus(userId: string) {
		try {
			const { data } = await httpClient.get<{ status: string, emailStatus: string }>(`/users/${userId}/status`, {
				headers: { 'X-Api-Key': _apiKey, 'Authorization': `Bearer ${_accessToken}` },
			});

			return data;
		} catch (e: any) {
			console.error("getUserStatus error:", _getErrorFromAxiosError(e));
			throw e;
		}
	}

	function _getErrorFromAxiosError(e: any) {
		if (e.response) return e.response.data;
		else if (e.request) return e.request;
		else return e.message;
	}

	return {
		createApiKey,
		getApiKeys,
		validateApiKey,
		requestLogin,
		createUser,
		updateUser,
		requestEmailVerification,
		loginUser,
		getUserStatus,
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

interface AuthToken {
	token: string;
	refreshToken: string;
	issuedAt: string;
	expAt: string;
}

interface User {
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

interface UserUpdate {
	walletAddress?: string;
	firstName?: string;
	middleName?: string;
	lastName?: string;
}

export interface VisitorData {
	visitorId?: string;
	requestId?: string;
}