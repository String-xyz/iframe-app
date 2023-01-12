export class EventEmitter {
	private listeners: any = {};

	on(event: string, callback: Function) {
		if (!this.listeners.hasOwnProperty(event)) {
			this.listeners[event] = [];
		}

		this.listeners[event].push(callback);

		return this;
	}

	once(event: string, callback: Function) {
		if (!this.listeners.hasOwnProperty(event)) {
			this.listeners[event] = [];
		}

		const onceCallback = (...data: any) => {
			callback.call(this, ...data);
			this.removeListener(event, onceCallback);
		};

		this.listeners[event].push(onceCallback);

		return this;
	}

	emit(event: string, ...data: any) {
		if (!this.listeners.hasOwnProperty(event)) {
			return null;
		}

		for (let i = 0; i < this.listeners[event].length; i++) {
			const callback = this.listeners[event][i];

			callback.call(this, ...data);
		}
	}

	removeListener(event: string, callback: Function) {
		if (!this.listeners.hasOwnProperty(event)) {
			return null;
		}

		const index = this.listeners[event].indexOf(callback);

		if (index > -1) {
			this.listeners[event].splice(index, 1);
		}
	}

	removeAllListeners(event: string) {
		if (!this.listeners.hasOwnProperty(event)) {
			return null;
		}

		this.listeners[event] = [];
	}

	getListeners(event: string) {
		if (!this.listeners.hasOwnProperty(event)) {
			return null;
		}

		return this.listeners[event];
	}

	getEvents() {
		return Object.keys(this.listeners);
	}

	getListenerCount(event: string) {
		if (!this.listeners.hasOwnProperty(event)) {
			return null;
		}

		return this.listeners[event].length;
	}
}

// TODO: Add unit tests

// src/lib/events.test.ts
// import EventEmitter from './events';

// describe('EventEmitter', () => {

// 	let eventEmitter: EventEmitter;

// 	beforeEach(() => {
// 		eventEmitter = new EventEmitter();
// 	});

// 	it('should be able to add an event listener', () => {
// 		const callback = jest.fn();
// 		eventEmitter.on('test', callback);

// 		expect(eventEmitter.getListenerCount('test')).toBe(1);
// 	});

// 	it('should be able to remove an event listener', () => {
// 		const callback = jest.fn();
// 		eventEmitter.on('test', callback);
// 		eventEmitter.removeListener('test', callback);

// 		expect(eventEmitter.getListenerCount('test')).toBe(0);
// 	});

// 	it('should be able to remove all event listeners', () => {
// 		const callback = jest.fn();
// 		eventEmitter.on('test', callback);
// 		eventEmitter.removeAllListeners('test');

// 		expect(eventEmitter.getListenerCount('test')).toBe(0);
// 	});

// 	it('should be able to get all event listeners', () => {
// 		const callback = jest.fn();
// 		eventEmitter.on('test', callback);

// 		expect(eventEmitter.getListeners('test')).toEqual([callback]);
// 	});

// 	it('should be able to get all events', () => {
// 		const callback = jest.fn();
// 		eventEmitter.on('test', callback);

// 		expect(eventEmitter.getEvents()).toEqual(['test']);
// 	});

// 	it('should be able to get the number of event listeners', () => {
// 		const callback = jest.fn();
// 		eventEmitter.on('test', callback);

// 		expect(eventEmitter.getListenerCount('test')).toBe(1);
// 	});

// 	it('should be able to emit an event', () => {
// 		const callback = jest.fn();
// 		eventEmitter.on('test', callback);
// 		eventEmitter.emit('test', 'test');

// 		expect(callback).toHaveBeenCalledWith('test');
// 	});

// }