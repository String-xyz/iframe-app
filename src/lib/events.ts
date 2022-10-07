import { contractPayload, modalProps, isAuthorized } from '$lib/stores';
import { parsePayload } from '$lib/utils';
import { get as getStore } from 'svelte/store'

const CHANNEL = "STRING_PAY"

export enum Events {
	INIT = "init"
}

export const sendEvent = (eventName, data) => {
	const message = JSON.stringify({
	  channel: CHANNEL,
	  event: { eventName, payload: data },
	});

	window.parent.postMessage(message, '*');
};

export const handleEvent = (event) => {
	console.log("in iframe handleEvent", event)
	let payload;
	switch (event.eventName) {
		case Events.INIT:
			payload = parsePayload(event.payload);
			console.log("[iframe event.ts] payload", payload)
			contractPayload.set(payload.contractParams);
			modalProps.set({item: payload.item});

			isAuthorized.set(true);


			console.log("[iframe event.ts] isAuthorized", getStore(isAuthorized))
		break;
	
		default:
			break;
	}
}

export const registerEvents = () => {
	console.log("[iframe events.ts] registerEvents ")
	window.addEventListener('message', function (e) {
		if (e.data?.data?.name) return;
		console.log("On iframe side", e)
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
	}, true);		
}