import { EventEmitter } from './EventEmitter';

const CHANNEL = "STRING_PAY";
export const sdkEvents = new EventEmitter();

export interface StringEvent<T = any> {
	eventName: string;
	data?: T;
	error?: any;
}


export enum Events {
	LOAD_PAYLOAD = 'load_payload',
	UPDATE_USER = 'update_user',
	IFRAME_READY = 'ready',
	IFRAME_RESIZE = 'resize',
	IFRAME_CLOSE = 'close',
	REQUEST_SIGNATURE = 'request_signature',
	RECEIVE_SIGNATURE = 'receive_signature',
	REQUEST_LOGIN = 'request_login',
	RECEIVE_LOGIN = 'receive_login',
	REQUEST_USER_STATUS = 'request_user_status',
	RECEIVE_USER_STATUS = 'receive_user_status',
	RECEIVE_CREATE_USER = "RECEIVE_CREATE_USER",
	REQUEST_CREATE_USER = "REQUEST_CREATE_USER",
	REQUEST_UPDATE = "REQUEST_UPDATE",
	RECEIVE_UPDATE = "RECEIVE_UPDATE",
	REQUEST_EMAIL_VERIFICATION = "REQUEST_EMAIL_VERIFICATION",
	REQUEST_REFRESH_TOKEN = "REQUEST_REFRESH_TOKEN",
	REQUEST_QUOTE = "REQUEST_QUOTE",
	RECEIVE_QUOTE = "RECEIVE_QUOTE"
}

export const sendEvent = (eventName: string, data?: any) => {
	const message = JSON.stringify({
		channel: CHANNEL,
		event: { eventName, data },
	});

	window.parent.postMessage(message, '*');
};

export const registerEvents = async () => {
	window.addEventListener('message', async (e) => {
		// Filter Metamask events
		if (e.data?.data?.name) return;

		// Filter Checkout events
		if (e.data?.type == "cko-msg") return;

		// Our messages
		try {
			const payload = JSON.parse(e.data);
			const event = payload.event
			if (payload.channel == CHANNEL) {
				// await handleEvent(event)
				console.log("Iframe :: Event received ", event);
				// propagate events
				sdkEvents.emit(event.eventName, event);
			}
		} catch (error) {
			console.log(error);
		}
	}, true);
}

export function promisifyEvent<T = any>(eventName: Events): Promise<T> {
	return new Promise((resolve, reject) => {
		sdkEvents.once(eventName, (event: StringEvent<T>) => {
			if (event.error) return reject(event.error);
			if (!event.data) return reject({ code: 'EVENT_NO_DATA' })

			return resolve(event.data);
		});

		// if this is event is not received within 60 seconds, reject the promise
		setTimeout(() => {
			reject({ code: 'EVENT_TIMEOUT' });
		}, 60000);
	});
}