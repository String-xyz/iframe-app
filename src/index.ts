import { Events, sendEvent, registerEvents, sdkEvents, type StringEvent } from '$lib/events/events';
import { __user, modalManager, item } from '$lib/stores';
import { type IframePayload, zNFT, zUser } from '$lib/types';

import AuthWallet from '$lib/modals/onboarding/AuthWallet.svelte';

// Validate payload before it reaches the API so nothing breaks
export const parsePayload = (payload: IframePayload) => {
	try {
		const nft = zNFT.parse(payload.nft);
		const user = zUser.parse(payload.user);

		return { item: nft, user }
	} catch (e: any) {
		console.debug("Error parsing payload", e);
		alert("An unexpected error has occurred. Please try again.");
	}
}

export const startIframe = async () => {
	await registerEvents();
	sdkEvents.on(Events.LOAD_PAYLOAD, (event: StringEvent) => {
		if (event.error) return console.error('Error initializing iframe', event.error);

		const payload = parsePayload(event.data);
		if (!payload) return;

		item.set(payload.item);
		__user.set(payload.user);

		modalManager.set(AuthWallet);
	});

	sendEvent(Events.IFRAME_READY);
}
