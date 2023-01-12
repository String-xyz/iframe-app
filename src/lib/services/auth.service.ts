import { createLocationService, apiClient } from '$lib/services';
import type { VisitorData } from './apiClient';
import { browser } from "$app/environment";
import { Events, sendEvent, subscribeEvent } from '$lib/events';
import { __nonce, __signature } from '$lib/stores';

const locationService = createLocationService();

const previousAttempt = { signature: "", nonce: "" };

export const getVisitorData = async () => {
	const visitorData = await locationService.getVisitorData();

	// Use your own values if you want
	// visitorData.visitorId = "uNngbc1ug3xpZ1czqqJH";
	// visitorData.requestId = "1672778461626.kiTB1x";

	return visitorData;
}

export const retryLogin = async () => {
	if (!previousAttempt.signature) throw { code: "UNAUTHORIZED" };

	const visitorData = await getVisitorData();
	const data = await apiClient.loginUser(previousAttempt.nonce, previousAttempt.signature, visitorData);
	return data;
}

async function requestSignature(nonce: string): Promise<string> {
	console.log('iframe: --- requestSignature', nonce);
	// 1. send REQUEST_SIGNATURE event to parent
	sendEvent(Events.REQUEST_SIGNATURE, nonce);

	// 2. wait for RECEIVE_SIGNATURE event from parent
	return new Promise((resolve, reject) => {
		subscribeEvent(Events.RECEIVE_SIGNATURE, (event) => {
			const signature = event.data;
			resolve(signature);
		});

		// if this is event is not received within 60 seconds, reject the promise
		setTimeout(() => {
			reject();
		}, 60000);
	});
}

export const login = async (nonce: string, signature: string, visitorData: VisitorData) => {
	const data = await apiClient.loginUser(nonce, signature, visitorData);
	return data;
};

export const loginOrCreateUser = async (walletAddress: string) => {
	const { nonce } = await apiClient.requestLogin(walletAddress);
	const signature = await requestSignature(nonce);
	const visitorData = await getVisitorData();

	__nonce.set(nonce);
	__signature.set(signature);
	__nonce.subscribe((n) => { previousAttempt.nonce = n; });
	__signature.subscribe((s) => { previousAttempt.signature = s; });

	try {
		const data = await apiClient.createUser(nonce, signature, visitorData);
		return data;
	} catch (err: any) {
		// if user already exists, try to login
		if (err.code === "CONFLICT") return login(nonce, signature, visitorData);
		throw err;
	}
};

export const logout = async () => {
	if (browser) {
		window.localStorage.clear();
	}

	try {
		await apiClient.logoutUser();
	} catch {
		return;
	}
}
