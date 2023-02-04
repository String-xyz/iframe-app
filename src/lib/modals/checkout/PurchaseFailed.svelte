<script lang="ts">
	import ModalBase from './ModalBase.svelte';

	import NFTDetails from '$lib/components/checkout/NFTDetails.svelte';
	import StyledButton from '$lib/components/shared/StyledButton.svelte';
	import OrderConfirmation from './OrderConfirmation.svelte';

	import { modalManager } from '$lib/stores';
	import { onMount } from 'svelte';
	import { sdkService } from '$lib/services';

	onMount(() => {
		sdkService.requestQuoteStop();
	});

	const back = () => {
		modalManager.set(OrderConfirmation);
	};
</script>

<ModalBase title="Purchase failed">
	<NFTDetails />
	<div class="divider" />
	<p class="text-red-500 mb-8 text-center">We are unable to complete your purchase due to an API error</p>
	<div class="text-center">
		<StyledButton action={back}>Try again</StyledButton>
	</div>
</ModalBase>
