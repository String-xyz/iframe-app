import { writable, type Writable } from 'svelte/store';
import { post, get } from '$lib/services/api';
import { ethers } from "ethers";


interface WalletSignaturePayload {
	address: string;
	timestamp: number;
	nonce: string;
	signature: string;
}


export const isAuthorized: Writable<boolean> = writable(false);
export const API_KEY: Writable<string> = writable("");
export const JWT_TOKEN: Writable<string> = writable("");
export const email: Writable<string> = writable("");

export const login = async (walletAddress: string) => {
	try {
		const data = await post('login/request', {
			walletAddress
		});

		const sig = await getSignature({address: data.address, timestamp: data.timestamp, nonce: data.nonce, signature: data.signature});

		const login = await post('login', {
			...sig
		});

	} catch (e) {
		console.error("Could not login ", e)
	}
}

export const getSignature = async (payload: WalletSignaturePayload) => {
	const provider = new ethers.providers.Web3Provider((<any>window).ethereum);
	const signer = provider.getSigner();
	try {
		const message = JSON.stringify(payload)

		console.log(message)
		
		const signature = await signer.signMessage(message);	
		console.log(signature)
		payload.signature = signature;

		return {...payload}
	} catch (err: any) {
		if (err.code == 4001) {
			console.log("Login rejected")
		} else {
			console.error(err)
		}
	}	
}

export const register = async (firstName: string, lastName: string, email: string, password: string) => {
	try {
		const data = await post('auth/register', {
			firstName,
			lastName,
			email,
			password
		});
		
		return data
	} catch (e) {
		console.error("Could not register ", email)
	}
}

export const checkUserExists = async (walletAddress: string) => {
	try {
		const data = await get('user', {
			walletAddress
		});
		
		return data
	} catch (e) {
		console.error("Could not check user ", walletAddress)
	}
}

