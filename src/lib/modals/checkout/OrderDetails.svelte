<script lang="ts">
	import ModalBase from './ModalBase.svelte';
	import { modalManager } from '$lib/stores';

	import NFTDetails from '$lib/components/checkout/NFTDetails.svelte';
	import PurchaseSummary from '$lib/components/checkout/PurchaseSummary.svelte';
	import OrderConfirmation from './OrderConfirmation.svelte';
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
		<button on:click={next} class="btn btn-wide btn-primary rounded border-2 tracking-wider	text-white">
			Next
			<img class="ml-2" src="/assets/next_arrow.svg" alt="next" /> 
		</button>
		<span on:click={back} class="inline-block mt-6 cursor-pointer">
			Cancel
		</span>
	</div>
</ModalBase>
