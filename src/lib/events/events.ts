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
	RECEIVE_CONFIRM_TRANSACTION = "RECEIVE_CONFIRM_TRANSACTION"
}

export const sendEvent = (eventName: string, data?: any) => {
	console.log('4. authorizeWallet', eventName, data);
	const message = JSON.stringify({
		channel: CHANNEL,
		event: { eventName, data },
	});

	console.log('5. authorizeWallet', message);
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

export function promisifyEvent<T = any>(eventName: Events, { timeout = 60000 } = {}): Promise<T> {
	console.log('6. authorizeWallet');

	return new Promise((resolve, reject) => {
		console.log('7. authorizeWallet');

		sdkEvents.once(eventName, (event: StringEvent<T>) => {
			console.log('8. authorizeWallet', event.error);

			if (event.error) return reject(event.error);
			console.log('9. authorizeWallet');

			if (!event.data) return reject({ code: 'EVENT_NO_DATA' })
			console.log('10. authorizeWallet');

			return resolve(event.data);
		});

		// if this is event is not received within 60 seconds, reject the promise
		setTimeout(() => {
			console.log('11. authorizeWallet');
			reject({ code: 'EVENT_TIMEOUT' });
		}, timeout);
	});
}