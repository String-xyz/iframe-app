import axios from 'axios';

// function createApiClient({ axiosInstance }: { axiosInstance: Axios }) {
export function createApiClient() {
	const baseUrl = import.meta.env.VITE_API_BASE_PATH;
	let store = {
		apiKey: '', // starts as empty string, but will be set by an interceptor
		accessToken: ''
	};

	const commonHeaders: any = {
		'Content-Type': 'application/json',
		'X-Api-Key': store.apiKey
	}

	const httpClient = axios.create({
		baseURL: baseUrl,
		headers: commonHeaders
	});

	async function createApiKey() {
		const { data } = await httpClient.post<{ apiKey: string }>('/apikeys');
		_setApiKeyHeader(data.apiKey);
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

	async function createUser(nonce: string, signature: string) {
		try {
			const { data } = await httpClient.post<{ authToken: AuthToken, user: User }>(`/users`, { nonce, signature }, {
				headers: { 'X-Api-Key': store.apiKey },
			});
			// set the access token in the store
			_seyAccessToken(data.authToken?.token);

			return data;
		} catch (e: any) {
			console.error("createUser error:", _getErrorFromAxiosError(e));
			throw e;
		}
	}

	async function updateUser(userId: string, update: UserUpdate) {
		const { data } = await httpClient.put<User>(`/users/${userId}`, update, {
			headers: { 'X-Api-Key': store.apiKey, 'Authorization': `Bearer ${store.accessToken}` },
		});
		return data;
	}

	async function requestEmailVerification(userId: string, email: string) {
		await httpClient.get(`/users/${userId}/verify-email`, {
			headers: { 'X-Api-Key': store.apiKey, 'Authorization': `Bearer ${store.accessToken}` },
			params: { email }
		});
		return
	}

	async function loginUser(nonce: string, signature: string) {
		try {
			const { data } = await httpClient.post<{ authToken: AuthToken, user: User }>(`/login/sign`, { nonce, signature }, {
				headers: { 'X-Api-Key': store.apiKey },
			});
			// set the access token in the store
			_seyAccessToken(data.authToken?.token);

			return data;
		} catch (e: any) {
			console.error("createUser error:", _getErrorFromAxiosError(e));
			throw e;
		}
	}


	async function getUserStatus(userId: string) {
		try {
			const { data } = await httpClient.get<{ authToken: AuthToken, user: User }>(`/users/${userId}/status`, {
				headers: { 'X-Api-Key': store.apiKey, 'Authorization': `Bearer ${store.accessToken}` },
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

	function _seyAccessToken(accessToken: string) {
		store.accessToken = accessToken;
	}

	function _setApiKeyHeader(_apiKey: string) {
		store.apiKey = _apiKey;
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
		getUserStatus
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