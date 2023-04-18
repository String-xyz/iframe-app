<script lang="ts">
	import ModalBase from '../ModalBase.svelte';
	import StyledButton from '$lib/components/shared/StyledButton.svelte';
	import NFTDetails from '$lib/components/checkout/NFTDetails.svelte';

	import OrderConfirmation from './OrderConfirmation.svelte';

	import { onMount } from 'svelte';
	import { modalManager } from '$lib/stores';
	import { sdkService } from '$lib/services';

	onMount(() => {
		sdkService.requestQuoteStop();
	});

	const back = () => {
		modalManager.set(OrderConfirmation);
	}

</script>

<ModalBase title="Purchase failed" type="checkout">
	<NFTDetails />
	<div class="divider" />
	<p class="text-red-500 mb-8 text-center">An unexpected error has occurred with your transaction. You will not be charged. Please try again.</p>
	<div class="text-center">
		<StyledButton action={back}>Try again</StyledButton>
	</div>
</ModalBase>
