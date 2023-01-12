import { createLocationService, apiClient, } from '$lib/services';
import type { VisitorData } from '../types';
import { browser } from "$app/environment";
import { Events, sendEvent } from '$lib/events/events';
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

export const login = async (nonce: string, signature: string, visitorData: VisitorData) => {
	const data = await apiClient.loginUser(nonce, signature, visitorData);
	return data;
};

export const loginOrCreateUser = async (walletAddress: string) => {
	const { nonce } = await apiClient.requestLogin(walletAddress);
	const { signature } = await apiClient.requestSignature(nonce);
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
