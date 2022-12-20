import { writable, type Writable } from 'svelte/store';
import { post, get } from '$lib/services/api';
import { ethers } from "ethers";
import type { WalletSignaturePayload } from '$lib/types';

const TEST_JWT_TOKEN = import.meta.env.VITE_TEST_JWT_TOKEN
const ENV = import.meta.env.VITE_ENV

export const API_KEY: Writable<string> = writable("");
export const JWT_TOKEN: Writable<string> = writable("");
export const email: Writable<string> = writable("");
export const userId: Writable<string> = writable("");
export const accessToken: Writable<string> = writable("");
export const apiKey: Writable<string> = writable("");

export const userStore = {
	apiKey,
	accessToken,
	userId,
	email
};

export const getSignature = async (payload: WalletSignaturePayload) => {
	const provider = new ethers.providers.Web3Provider((<any>window).ethereum);
	const signer = provider.getSigner();
	try {
		const message = JSON.stringify(payload)

		const signature = await signer.signMessage(message);
		payload.signature = signature;

		return { ...payload }
	} catch (err: any) {
		if (err.code == 4001) {
			console.log("Login rejected")
		} else {
			console.error(err)
		}
	}
}

export const login = async (walletAddress: string) => {
	try {
		if (ENV === 'dev' && TEST_JWT_TOKEN) {
			JWT_TOKEN.set(TEST_JWT_TOKEN)
		} else {
			const data = await post('login/request', {
				walletAddress
			});

			const sig = await getSignature({address: data.address, timestamp: data.timestamp, nonce: data.nonce, signature: data.signature});

			const login = await post('login', {
				...sig
			});
		}

	} catch (e) {
		console.error("Could not login ", e)
	}
}