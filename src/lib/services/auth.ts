import { ethers } from 'ethers';
import { createAnalyticsService, apiClient } from '$lib/services';
import type { User } from './apiClient';

const analyticsService = createAnalyticsService();

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
	const visitorData = await analyticsService.getVisitorData();

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

export const login = async (walletAddress: string) => {
	const { nonce } = await apiClient.requestLogin(walletAddress);

	const signature = await requestSignature(nonce)

	const visitorData = await getVisitorData();

	previousAttempt.signature = signature;
	previousAttempt.nonce = nonce;

	try {
		const { user } = await apiClient.createUser(nonce, signature, visitorData);
		
		return { state: "USER_CREATED", user }
	} catch (err: any) {
		switch (err.code) {
			case "CONFLICT": {
				try {
					const { user } = await apiClient.loginUser(nonce, signature, visitorData);

					if (user.status !== 'email_verified') {
						return { state: AuthState.EMAIL_UNVERIFIED, user }
					}

					return { state: AuthState.AUTHORIZED, user }
				} catch (err: any) {
					console.error(err)
					return { state: AuthState.ERROR }
				}
			}

			case "UNPROCESSABLE_ENTITY": {
				return { state: AuthState.DEVICE_UNVERIFIED }
			}

			case "ERR_BAD_REQUEST": {
				return { state: AuthState.INVALID }
			}

			default: 
				throw err;
		}
	}
}