import type { Writable } from 'svelte/store';
import { ethers } from 'ethers';
import { createLocationService, apiClient } from '$lib/services';
import type { User } from './apiClient';

const locationService = createLocationService();

const previousAttempt = { signature: "", nonce: "" };

export enum AuthState {
	USER_CREATED = 'user_created',
	AUTHORIZED = 'authorized',
	EMAIL_UNVERIFIED = 'email_unverified',
	DEVICE_UNVERIFIED = 'device_unverified',
	INVALID = 'invalid',
	ERROR = 'error',
}

export interface AuthResponse {
	state: AuthState;
	user?: User;
}

export const requestSignature = async (nonce: string) => {
	const provider = new ethers.providers.Web3Provider(window.ethereum);
	await window.ethereum.request({ method: 'eth_requestAccounts' });

	const signer = provider.getSigner();
	const signature = await signer.signMessage(nonce);

	return signature;
}

export const getVisitorData = async () => {
	const visitorData = await locationService.getVisitorData();

	// Use your own values if you want
	// visitorData.visitorId = "uNngbc1ug3xpZ1czqqJH";
	// visitorData.requestId = "1672778461626.kiTB1x";

	return visitorData;
}

export const retryLogin = async () => {
	const visitorData = await getVisitorData();

	try {
		if (previousAttempt.signature) {
			const { user } = await apiClient.loginUser(previousAttempt.nonce, previousAttempt.signature, visitorData);

			return { state: AuthState.AUTHORIZED, user }
		}
	} catch (err: any) {
		switch (err.code) {
			case "UNPROCESSABLE_ENTITY":
				return { state: AuthState.DEVICE_UNVERIFIED }

			default:
				console.error(err);
		}
	}

	return { state: AuthState.INVALID }
}

export const login = async (walletAddress: string, userIdStore: Writable<string>) => {
	const { nonce } = await apiClient.requestLogin(walletAddress);

	const signature = await requestSignature(nonce)

	const visitorData = await getVisitorData();

	previousAttempt.signature = signature;
	previousAttempt.nonce = nonce;

	try {
		const { user } = await apiClient.createUser(nonce, signature, visitorData);
		userIdStore.set(user.id);

		return { state: AuthState.USER_CREATED, user }
	} catch (err: any) {
		switch (err.code) {
			case "CONFLICT": {
				try {
					const { user } = await apiClient.loginUser(nonce, signature, visitorData);
					userIdStore.set(user.id);

					if (user.status !== 'email_verified') {
						return { state: AuthState.EMAIL_UNVERIFIED, user }
					}

					return { state: AuthState.AUTHORIZED, user }

				} catch (err: any) {
					switch (err.code) {
						case "UNPROCESSABLE_ENTITY":
							return { state: AuthState.DEVICE_UNVERIFIED }

						// default:
						// 	throw err;
					}
				}
				break;
			}

			case "UNPROCESSABLE_ENTITY":
				return { state: AuthState.DEVICE_UNVERIFIED }

			case "ERR_BAD_REQUEST":
				return { state: AuthState.INVALID }

			default:
				throw err;
		}
	}

	return { state: AuthState.ERROR }
}

export const logout = async () => {
	return apiClient.logoutUser();
}
