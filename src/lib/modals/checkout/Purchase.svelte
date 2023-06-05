<script lang="ts">
	import { card, finalQuote, modalManager } from '$lib/stores';

	import ModalBase from '../ModalBase.svelte';
	import StyledButton from '$lib/components/shared/StyledButton.svelte';

	import ItemSummary from '$lib/components/checkout/ItemSummary.svelte';
	import QuoteSummary from '$lib/components/checkout/QuoteSummary.svelte';
	import PaymentSelect from '$lib/components/checkout/PaymentSelect.svelte';

	// $: disabled = $card?.token == undefined || $quote?.estimate.totalUSD == undefined;

	let disabled = true;
	// const purchase = () => {
	// 	finalQuote.set($quote);
	// 	modalManager.set(Processing);
	// };

	const handlePurchase = () => {

	}

</script>

<ModalBase>
	<div class="main flex flex-col justify-center items-center">
		<header class="grid grid-cols-4 items-center w-full mb-3">
			<img src="/assets/back_arrow.svg" alt="back" class="inline" />
			<h1 class="text-2xl whitespace-nowrap font-semibold">Complete your Purchase</h1>
		</header>

		<ItemSummary />

		<div class="my-3 w-full">
			<QuoteSummary />
		</div>

		<div class="mb-12 mr-auto w-full">
			<h2 class="text-gray-blue-100 text-xl font-semibold mb-2">Payment Method:</h2>
			<PaymentSelect />
		</div>

		<StyledButton
			action={handlePurchase}
			{disabled}
		>
			Buy Now
		</StyledButton>
	</div>
</ModalBase>
