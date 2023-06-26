<script lang="ts">
	import { onDestroy, onMount } from 'svelte';
	import { sdkService } from '$lib/services';
	import { sendEvent, Events, sdkEvents, type StringEvent } from '$lib/events';
	import { modalManager, quote, finalQuote,
		selectedCard, cardList, txResponse } from '$lib/stores';
	import type { Quote, TransactionRequest } from '$lib/types';

	import ModalBase from '../ModalBase.svelte';
	import StyledButton from '$lib/components/shared/StyledButton.svelte';

	import ItemSummary from '$lib/components/checkout/ItemSummary.svelte';
	import QuoteSummary from '$lib/components/checkout/QuoteSummary.svelte';
	import PaymentSelect from '$lib/components/checkout/PaymentSelect.svelte';
	import Spinner from '$lib/components/checkout/Spinner.svelte';

	import PurchaseSuccess from './PurchaseSuccess.svelte';
	import PurchaseFailed from './PurchaseFailed.svelte';

	$: disabled = !$selectedCard || $quote?.estimate.totalUSD == undefined;

	let isProcessing = false;

	let cvvInput = '';

	onMount(async () => {
		await sdkService.requestQuoteStart();
		sdkEvents.removeAllListeners(Events.QUOTE_CHANGED);
		sdkEvents.on(Events.QUOTE_CHANGED, (event: StringEvent) => {
			const _quote = <Quote>event.data.quote;
			quote.set(_quote);
		});

		const { cards } = await sdkService.getSavedCards();
		
		for (const savedCard of cards) {
			$cardList.push({
				cardId: savedCard.id,
				scheme: savedCard.scheme,
				last4: savedCard.last4,
				expiryMonth: savedCard.expiryMonth,
				expiryYear: savedCard.expiryYear,
				expired: savedCard.expired,
				isSavedCard: true
			});
		}

		$cardList = $cardList;

		$selectedCard = $cardList[0];
	});

	onDestroy(() => {
		sdkService.requestQuoteStop();
	});

	const handlePurchase = async () => {
		finalQuote.set($quote);
		if (!$finalQuote) return;

		try {
			isProcessing = true;

			let paymentInfo;
			
			if ($selectedCard?.isSavedCard) {
				paymentInfo = {
					cardId: $selectedCard?.cardId || "",
					cvv: cvvInput
				}
			} else {
				paymentInfo = {
					cardToken: $selectedCard?.token || "",
					saveCard: $selectedCard?.shouldSaveCard || false
				}
			}

			let txRequest: TransactionRequest = {
				quote: $finalQuote,
				paymentInfo
			}
			const tx = await sdkService.transact(txRequest);
			$txResponse = tx;

			modalManager.set(PurchaseSuccess);
		} catch (e) {
			console.error('transact error', e);
			isProcessing = false;

			modalManager.set(PurchaseFailed);
		}
	}

	const close = () => {
		modalManager.set(null);
		sendEvent(Events.IFRAME_CLOSE);
	}

</script>

<ModalBase>
	<div class="main flex flex-col justify-center items-center">
		<header class="grid grid-cols-4 items-center w-full mb-3">
			<div></div>
			<h1 class="text-2xl whitespace-nowrap font-semibold ">Complete your Purchase</h1>
			<div></div>
			<button on:click={close} class="ml-auto">
				<img src="/assets/headers/close.svg" alt="close" width="32px" height="32px" />
			</button>
		</header>

		<ItemSummary />

		<div class="my-3 w-full">
			<QuoteSummary />
		</div>

		<div class="mb-12 mr-auto w-full">
			<h2 class="text-gray-blue-100 text-xl font-semibold mb-2">Payment Method:</h2>
			<PaymentSelect bind:cvvInput />
		</div>

		{#if !isProcessing}
			<StyledButton
				action={handlePurchase}
				{disabled}
			>
				Buy Now
			</StyledButton>
		{:else}
			<StyledButton>
				<Spinner />
				<span class="ml-2">
					Processing Transaction
				</span>
			</StyledButton>
		{/if}
	</div>
</ModalBase>
