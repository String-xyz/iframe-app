import Onboarding from './lib/modals/onboarding/Onboarding.svelte';
import { Events, sendEvent, registerEvents, sdkEvents, type StringEvent } from '$lib/events/events';
import { contractPayload, modalManager, item } from '$lib/stores';
import { parsePayload } from '$lib/utils';
import { logout } from '$lib/services';

export const startIframe = async () => {
	await registerEvents();
	sdkEvents.on(Events.LOAD_PAYLOAD, (event: StringEvent) => {
		console.log("Iframe :: Event received ", event);
		const payload = parsePayload(event.data);
		item.set(payload.item);
		contractPayload.set(payload.contractParams);
		modalManager.set(Onboarding);
	});

	sdkEvents.on(Events.UPDATE_USER, async (event: StringEvent) => {
		console.log("Iframe :: Event received ", event);
		await logout();
		modalManager.set(null);
		sendEvent(Events.IFRAME_CLOSE);
	});

	sendEvent(Events.IFRAME_READY);
}