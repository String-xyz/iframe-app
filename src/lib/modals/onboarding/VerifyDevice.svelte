<script lang="ts">
	import { Events, sendEvent } from '$lib/events';
	import { modalManager, userEmailPreview } from '$lib/stores';
	import ModalBase from '../ModalBase.svelte';

	const close = () => {
		modalManager.set(null);
		sendEvent(Events.IFRAME_CLOSE);
	}

</script>

<ModalBase>
	<header class="flex justify-end w-full mb-5">
		<button on:click={close}>
			<img src="/assets/headers/close.svg" alt="close" />
		</button>
	</header>

	<div class="flex flex-col items-center">
		<h1 class="text-3xl font-semibold mb-5">Verify Device</h1>
		<div class="text-xl text-gray-blue-60 font-medium text-center">
			<p>We detected that you are using a new device.</p>
			<p class="mb-5">We’ve sent an email to <span class="font-semibold">{$userEmailPreview || "the email on file"}</span></p>
			<p>Follow the instructions in the email and wait for the screen to continue.</p>
		</div>
		<p class="mt-8">Don't see the email? Check your spam folder</p>
	</div>
</ModalBase>