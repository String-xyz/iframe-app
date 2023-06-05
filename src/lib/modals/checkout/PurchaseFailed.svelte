<script lang="ts">
	import { modalManager } from '$lib/stores';
	import { sendEvent, Events } from '$lib/events';

	import ModalBase from '../ModalBase.svelte';
	import StyledButton from '$lib/components/shared/StyledButton.svelte';
	import ItemSummary from '$lib/components/checkout/ItemSummary.svelte';

	import Purchase from './Purchase.svelte';

	const retryTransaction = () => {
		modalManager.set(Purchase);
	}

	const close = () => {
		modalManager.set(null);
		sendEvent(Events.IFRAME_CLOSE);
	}

	const handleKeyboard = (e: KeyboardEvent) => {
		if (e.key == "Escape") {
			close();
		}
	}

</script>

<svelte:window on:keydown={(e) => handleKeyboard(e)} />

<ModalBase>
	<header class="flex justify-end w-full mb-8">
		<button on:click={close}>
			<img src="/assets/headers/close.svg" alt="close" />
		</button>
	</header>
	<div class="main flex flex-col justify-center items-center">
		<img src="/assets/headers/failure.svg" alt="failure" class="mb-5" />
		<h1 class="text-3xl font-semibold mb-4">Transaction Failed</h1>
		<p class="text-gray-blue-60 text-lg text-center font-medium mb-12">
			An unexpected error has occurred with your transaction. You will not be charged. Please try again.
		</p>

		<ItemSummary />

		<StyledButton
			className="mt-12"
			action={retryTransaction}
		>
			Retry Transaction
		</StyledButton>
	</div>
</ModalBase>
