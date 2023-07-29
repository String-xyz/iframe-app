<script lang="ts">
	import { modalManager, txResponse, selectedCard, finalQuote } from '$lib/stores';
	import { sendEvent, Events } from '$lib/events';
	import { abbrevAddr } from '$lib/utils';

	import ModalBase from '../ModalBase.svelte';
	import ItemSummary from '$lib/components/checkout/ItemSummary.svelte';

	const dateOptions: Intl.DateTimeFormatOptions = {
		year: 'numeric',
		month: 'numeric',
		day: 'numeric',
		hour: 'numeric',
		minute: '2-digit'
	}

	const formatTimestamp = (timestamp: string) => {
		return new Date(timestamp).toLocaleString('en-US', dateOptions);
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
		<img src="/assets/headers/success.svg" alt="success" class="mb-5" />
		<h1 class="text-3xl font-semibold mb-4">Thank you for your purchase!</h1>
		<p class="text-gray-blue-60 text-lg font-medium mb-12">We sent a receipt to your email.</p>
		<ItemSummary />

		<div class="mt-12 mb-6 w-full">
			<h2 class="text-gray-blue-100 text-lg font-semibold mr-auto">Purchase Summary</h2>
			<div class="divider my-3" />
			<div class="text-gray-blue-60 text-lg font-medium select-text">
				<div class="flex justify-between mb-4">
					<span>Transaction</span>
					<a href={$txResponse.txUrls[$txResponse.txUrls.length - 1]} target="_blank" rel="noopener noreferrer" class="flex items-center">
						<span class="text-primary mr-2">{abbrevAddr($txResponse.txIds[$txResponse.txIds.length - 1])}</span>
						<img class="inline" src="/assets/ext_link.svg" alt="Tx link" />
					</a>
				</div>
				{#if $selectedCard}
					<div class="flex justify-between mb-4">
						<span>Payment method</span>
						<span>{$selectedCard.scheme} *{$selectedCard.last4}</span>
					</div>
				{/if}
				<div class="flex justify-between mb-4">
					<span>Date</span>
					<span>{formatTimestamp($txResponse.txTimestamp)}</span>
				</div>
				<div class="divider my-3" />
				<div class="flex justify-between">
					<span>Total</span>
					<span>${$finalQuote?.estimate.totalUSD}</span>
				</div>
			</div>
		</div>
	</div>
</ModalBase>
