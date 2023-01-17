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
	REQUEST_AUTHORIZE_USER = 'request_authorize_user',
	RECEIVE_AUTHORIZE_USER = 'receive_authorize_user',
	REQUEST_RETRY_LOGIN = 'request_retry_login',
	RECEIVE_RETRY_LOGIN = 'receive_retry_login',
	REQUEST_EMAIL_VERIFICATION = "REQUEST_EMAIL_VERIFICATION",
	RECEIVE_EMAIL_VERIFICATION = "RECEIVE_EMAIL_VERIFICATION",
	REQUEST_CONFIRM_TRANSACTION = "REQUEST_CONFIRM_TRANSACTION",
	RECEIVE_CONFIRM_TRANSACTION = "RECEIVE_CONFIRM_TRANSACTION",
	REQUEST_QUOTE_START = "REQUEST_QUOTE_START",
	QUOTE_CHANGED = "QUOTE_CHANGED",
	REQUEST_QUOTE_STOP = "REQUEST_QUOTE_STOP"
};

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
				// propagate events
				sdkEvents.emit(event.eventName, event);
			}
		} catch (error) {
			console.log(error);
		}
	}, true);
}

// document this function
/**
 * Promisify an event. This function will return a promise that will resolve when the event is emitted.
 * @param eventName The name of the event to listen for
 * @param {timeout} The number of seconds to wait before rejecting the promise
 * @returns A promise that will resolve with the event data
 */
export function promisifyEvent<T = any>(eventName: Events, { timeout = 60 } = {}): Promise<T> {
	return new Promise((resolve, reject) => {
		sdkEvents.once(eventName, (event: StringEvent<T>) => {
			try {
				if (event.error) return reject(event.error);

				// check for nil values but allow boolean false
				if (event.data === undefined || event.data == null || event.data === '' || Object.keys(event.data).length === 0) return reject({ code: 'EVENT_NO_DATA' })

				return resolve(event.data);
			} catch (e) {
				return reject(e);
			}
		});

		// if this is event is not received within 60 seconds, reject the promise
		setTimeout(() => {
			reject({ code: 'EVENT_TIMEOUT' });
		}, timeout * 1000);
	});
}
