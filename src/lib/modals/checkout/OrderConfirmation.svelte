<script lang="ts">
	import ModalBase from './ModalBase.svelte';
	import { card, quote, finalQuote, modalManager } from '$lib/stores';
	import type { NFT } from '$lib/types';

	import PurchaseSummary from '$lib/components/checkout/PurchaseSummary.svelte';
	import CardSelect from '$lib/components/checkout/CardSelect.svelte';
	import Address from '$lib/components/checkout/Address.svelte';
	import OrderDetails from './OrderDetails.svelte';
	import Processing from './Processing.svelte';

	export let item: NFT;

	$: disabled = $card?.token == undefined || $quote?.data?.quote == undefined;

	const purchase = () => {
		finalQuote.set($quote);
		modalManager.set(Processing);
	};

	const back = () => {
		modalManager.set(OrderDetails);
	};
</script>

<ModalBase title="Order confirmation">
	<Address />
	<CardSelect />
	<PurchaseSummary {item} />
	<div class="text-center mt-6">
		<button on:click={purchase} class="btn btn-wide btn-primary rounded border-2 text-white tracking-wider block font-bold m-auto" {disabled}>Confirm and Pay</button>
		<span on:click={back} class="inline-block mt-6 cursor-pointer">
			<img class="inline mr-2" src="/assets/back_arrow.svg" alt="back arrow">
			Back
		</span>
	</div>
</ModalBase>

<style>
	.btn[disabled] {
		background-color: #A8A6FF;
		color: white;
	}
</style>