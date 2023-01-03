
export function createUserService(): UserService {

	async function isLoggedIn() {
		// TODO: Implement
		return true;
		// return window.ethereum.request({ method: 'eth_requestAccounts' });
	}

	return {
		isLoggedIn
	};
}

export interface UserService {
	isLoggedIn: () => Promise<boolean>;
}