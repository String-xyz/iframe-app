import Onboarding from './lib/modals/onboarding/Onboarding.svelte';

import { Events, sendEvent, registerEvents, sdkEvents, type StringEvent } from '$lib/events/events';
import { __user, modalManager, item } from '$lib/stores';
import { parsePayload } from '$lib/utils';

export const startIframe = async () => {
	await registerEvents();
	sdkEvents.on(Events.LOAD_PAYLOAD, (event: StringEvent) => {
		const payload = parsePayload(event.data);
		if (!payload) return;

		item.set(payload.item);
		__user.set(payload.user);
		modalManager.set(Onboarding);
	});

	sendEvent(Events.IFRAME_READY);
}