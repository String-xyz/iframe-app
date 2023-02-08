import { EventEmitter } from '../../lib/events/EventEmitter';

describe('EventEmitter', () => {

	let eventEmitter: EventEmitter;

	beforeEach(() => {
		eventEmitter = new EventEmitter();
	});

	it('should be able to add an event listener', () => {
		const callback = () => { };
		eventEmitter.on('test', callback);

		expect(eventEmitter.getListenerCount('test')).toBe(1);
	});

	it('should be able to remove an event listener', () => {
		const callback = () => { };
		eventEmitter.on('test', callback);
		eventEmitter.removeListener('test', callback);

		expect(eventEmitter.getListenerCount('test')).toBe(0);
	});

	it('should be able to remove all event listeners', () => {
		const callback = () => { };
		eventEmitter.on('test', callback);
		eventEmitter.removeAllListeners('test');

		expect(eventEmitter.getListenerCount('test')).toBe(0);
	});

	it('should be able to get all event listeners', () => {
		const callback = () => { };
		eventEmitter.on('test', callback);

		expect(eventEmitter.getListeners('test')).toEqual([callback]);
	});

	it('should be able to get all events', () => {
		const callback = () => { };
		eventEmitter.on('test', callback);

		expect(eventEmitter.getEvents()).toEqual(['test']);
	});

	it('should be able to get the number of event listeners', () => {
		const callback = () => { };
		eventEmitter.on('test', callback);

		expect(eventEmitter.getListenerCount('test')).toBe(1);
	});
});