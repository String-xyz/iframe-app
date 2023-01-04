<script lang="ts">
	import ModalBase from './ModalBase.svelte';
	import BackButton from '$lib/components/shared/BackButton.svelte';
	import StyledButton from '$lib/components/shared/StyledButton.svelte';

	import PurchaseSummary from '$lib/components/checkout/PurchaseSummary.svelte';
	import CardSelect from '$lib/components/checkout/CardSelect.svelte';
	import Address from '$lib/components/checkout/Address.svelte';

	import OrderDetails from './OrderDetails.svelte';
	import Processing from './Processing.svelte';

	import { card, quote, finalQuote, modalManager } from '$lib/stores';

	$: disabled = $card?.token == undefined || $quote?.totalUSD == undefined;

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
	<PurchaseSummary />
	<div class="text-center mt-6">
		<StyledButton action={purchase} {disabled}>Confirm and Pay</StyledButton>
		<BackButton {back} />
	</div>
</ModalBase>
