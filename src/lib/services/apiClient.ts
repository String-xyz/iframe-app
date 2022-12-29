import axios from 'axios';
import { userStore } from '$lib/stores';

// function createApiClient({ axiosInstance }: { axiosInstance: Axios }) {
export function createApiClient() {
	const baseUrl = import.meta.env.VITE_API_BASE_PATH;

	let _apiKey = '';
	let _accessToken = '';
	let _refreshToken = '';

	userStore.apiKey.subscribe((value) => _apiKey = value);
	userStore.accessToken.subscribe((value) => _accessToken = value);
	userStore.refreshToken.subscribe((value) => _refreshToken = value);

	const commonHeaders: any = {
		'Content-Type': 'application/json',
	}

	const httpClient = axios.create({
		baseURL: baseUrl,
		headers: commonHeaders,
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
			// const { data } = await httpClient.post<{ authToken: AuthToken, user: User }>(`/users`, body, { headers });
			const { data } = await httpClient.post(`/users`, body, { headers });
			// set store values
			userStore.accessToken.set(data.authToken?.token);
			userStore.refreshToken.set(data.authToken?.refreshToken);
			userStore.userId.set(data.user.id);

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

	// Response interceptor to refresh the access token. Every time a request is made, the interceptor will check if the access token is expired.
	// If it is, it will try to refresh the token, and then retry the original request.
	httpClient.interceptors.response.use(
		response => response,
		async error => {
			if (error.response.status === 401 && error.response.data.code === 'TOKEN_EXPIRED') {
				console.log('------- refreshing token....')
				const originalRequest = error.config;
				try {
					const body = { refreshToken: _refreshToken };
					const headers = { 'X-Api-Key': _apiKey };
					const res = await httpClient.post<AuthToken>(`/login/refresh`, body, { headers });
					if (!res) throw new Error("no data returned from refresh token request");

					// update the access token in the userStore
					userStore.accessToken.set(res.data.token);
					userStore.refreshToken.set(res.data.refreshToken);
					// retry the original request with the new access token
					originalRequest.headers['Authorization'] = `Bearer ${res.data.token}`;
					return httpClient(originalRequest);
				} catch (e: any) {
					console.error("refresh token error:", _getErrorFromAxiosError(e));
					// TODO: logout user. For now, just throw the error
					return Promise.reject(error);
				}
			}

			return Promise.reject(error);
		});

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