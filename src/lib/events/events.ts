import { EventEmitter } from './EventEmitter';

const CHANNEL = 'string-checkout-frame';
export const sdkEvents = new EventEmitter();

export interface StringEvent<T = any> {
	eventName: string;
	data?: T;
	error?: any;
}

export enum Events {
	IFRAME_READY = 'ready',
	RES_IFRAME_READY = 'res_ready',
	IFRAME_RESIZE = 'resize',
	IFRAME_CLOSE = 'close',
	REQUEST_AUTHORIZE_USER = 'authorize_user',
	RECEIVE_AUTHORIZE_USER = 'res_authorize_user',
	REQUEST_RETRY_LOGIN = 'retry_login',
	RECEIVE_RETRY_LOGIN = 'res_retry_login',
	REQUEST_UPDATE_USER = 'update_user',
	RECEIVE_UPDATE_USER = 'res_update_user',
	REQUEST_EMAIL_VERIFICATION = 'email_verification',
	RECEIVE_EMAIL_VERIFICATION = 'res_email_verification',
	REQUEST_EMAIL_PREVIEW = 'email_preview',
	RECEIVE_EMAIL_PREVIEW = 'res_preview',
	REQUEST_DEVICE_VERIFICATION = 'device_verification',
	RECEIVE_DEVICE_VERIFICATION = 'res_device_verification',
	REQUEST_SAVED_CARDS = 'saved_cards',
	RECEIVE_SAVED_CARDS = 'res_saved_cards',
	REQUEST_CONFIRM_TRANSACTION = 'confirm_transaction',
	RECEIVE_CONFIRM_TRANSACTION = 'res_confirm_transaction',
	REQUEST_QUOTE = 'get_quote',
	RECEIVE_QUOTE = 'res_get_quote'
}

export const sendEvent = (eventName: string, data?: any) => {
	const message = JSON.stringify({
		channel: CHANNEL,
		data: { eventName, data }
	});

	window.parent.postMessage(message, '*');
};

export const registerEvents = async () => {
	const eventHandler = async (e: any) => {
		// Filter Metamask events
		if (e.data?.data?.name) return;

		// Filter Checkout events
		if (e.data?.type == 'cko-msg') return;

		// Our messages
		try {
			const payload = JSON.parse(e.data);
			const event = payload.data;
			if (payload.channel == CHANNEL) {
				// propagate events
				sdkEvents.emit(event.eventName, event);
			}
		} catch (error) {
			console.log(error);
		}
	};

	window.removeEventListener('message', eventHandler, true);
	window.addEventListener('message', eventHandler, true);
};

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
				if (event.data === undefined || event.data == null || event.data === '')
					return reject({ code: 'EVENT_NO_DATA' });

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
