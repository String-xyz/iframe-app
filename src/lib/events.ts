import { contractPayload, modalManager, item } from '$lib/stores';
import { parsePayload } from '$lib/utils';
import WalletLogin from '$lib/modals/onboarding/WalletLogin.svelte';

const CHANNEL = "STRING_PAY"

interface StringEvent {
	eventName: string;
	data?: any;
}

export enum Events {
	LOAD_PAYLOAD = 'load_payload',
	IFRAME_READY = 'ready',
	IFRAME_RESIZE = 'resize',
	IFRAME_CLOSE = 'close',
}

export const sendEvent = (eventName: string, data?: any) => {
	const message = JSON.stringify({
	  channel: CHANNEL,
	  event: { eventName, data },
	});

	window.parent.postMessage(message, '*');
};

const handleEvent = async (event: StringEvent) => {
	let payload;
	switch (event.eventName) {
		case Events.LOAD_PAYLOAD:

			payload = parsePayload(event.data);
			contractPayload.set(payload.contractParams);
			item.set(payload.item);

			modalManager.set(WalletLogin)
			
		break;
	}
}

export const registerEvents = async () => {
	window.addEventListener('message', async (e) => {
		// Filter Metamask events
		if (e.data?.data?.name) return;

		// Filter Checkout events
		if (e.data?.type == "cko-msg") return;

		// Our messages
		try {
			const payload = JSON.parse(e.data);
			const channel = payload.channel;
			const event = payload.event
			if (channel == CHANNEL) {
				await handleEvent(event)
			}
		} catch (error) {
			console.log(error);
		}
	}, true);		
}
