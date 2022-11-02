import { contractPayload, modalProps, isAuthorized, apiKey } from '$lib/stores';
import { get as getStore } from 'svelte/store'
import { parsePayload } from '$lib/utils';

const CHANNEL = "STRING_PAY"

interface StringEvent {
	eventName: string;
	data?: any;
}

// interface CheckoutEvent {
// 	data: any;
// 	event: string;
// 	type: string;
// }

export enum Events {
	INIT = 'init',
	LOAD_PAYLOAD = 'load_payload',
	IFRAME_READY = 'ready',
	IFRAME_AUTHED = 'authed',
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

const handleEvent = (event: StringEvent) => {
	let payload;
	switch (event.eventName) {
		case Events.INIT:
			console.log(event)
			apiKey.set(event.data)
			console.log("apiKey ", getStore(apiKey))
			sendEvent(Events.IFRAME_AUTHED, {"valid": true})
		break;

		case Events.LOAD_PAYLOAD:
			payload = parsePayload(event.data);
			contractPayload.set(payload.contractParams);
			modalProps.set({item: payload.item});

			isAuthorized.set(true);
		break;
	}
}

// const handleCkoEvent = (e: CheckoutEvent) => {
// 	switch (e.event) {
// 		case "":
		
// 		break;
// 	}
// }

export const registerEvents = () => {
	window.addEventListener('message', function (e) {
		// Filter Metamask
		if (e.data?.data?.name) return;

		// Filter Checkout
		if (e.data?.type == "cko-msg") {
			// handleCkoEvent(e.data)
		} else {
			// Our messages
			try {
				const payload = JSON.parse(e.data);
				const channel = payload.channel;
				const event = payload.event
				if (channel == CHANNEL) {
					handleEvent(event)
				}
			} catch (error) {
				console.log(error);
			}
		}
	}, true);		
}