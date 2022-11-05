import { contractPayload, item, isAuthorized, login } from '$lib/stores';
import { parsePayload } from '$lib/utils';

const CHANNEL = "STRING_PAY"

const TEST_USER_EMAIL = import.meta.env.VITE_TEST_USER_EMAIL
const TEST_USER_PWD = import.meta.env.VITE_TEST_USER_PWD


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

			if (!TEST_USER_EMAIL || !TEST_USER_PWD) {
				console.error("No user email or password found, cannot get JWT token")
				break
			}
			
			await login('email', TEST_USER_EMAIL, TEST_USER_PWD)
			isAuthorized.set(true);
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
