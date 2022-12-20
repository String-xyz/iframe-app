<script lang="ts">
	import ModalBase from './ModalBase.svelte';
	import StyledButton from '$lib/components/shared/StyledButton.svelte';

	import NFTDetails from '$lib/components/checkout/NFTDetails.svelte';
	import PurchaseSummary from '$lib/components/checkout/PurchaseSummary.svelte';
	import OrderConfirmation from './OrderConfirmation.svelte';

	import { modalManager } from '$lib/stores';
	import { Events, sendEvent } from '$lib/events';

	const back = () => {
		modalManager.set(null);
		sendEvent(Events.IFRAME_CLOSE)
	};

	const next = () => {
		modalManager.set(OrderConfirmation);
	};
</script>

<ModalBase title="Pay with Card">
	<NFTDetails />
	<PurchaseSummary />
	<div class="text-center mt-6">
		<StyledButton action={next}>
			Next
			<img class="ml-2" src="/assets/next_arrow.svg" alt="next" /> 
		</StyledButton>
		<span on:click={back} class="inline-block cursor-pointer">
			Cancel
		</span>
	</div>
</ModalBase>
