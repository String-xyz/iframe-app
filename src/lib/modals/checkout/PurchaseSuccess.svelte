<script lang="ts">
	import ModalBase from './ModalBase.svelte';
	import { modalManager } from '$lib/stores';
	import { sendEvent, Events } from '$lib/events';

	import PurchaseSummary from '$lib/components/checkout/PurchaseSummary.svelte';
	import NFTDetails from '$lib/components/checkout/NFTDetails.svelte';

	const close = () => {
		modalManager.set(null);
		sendEvent(Events.IFRAME_CLOSE)
	}
	
</script>

<ModalBase title="You purchased this item!">
	<NFTDetails />
	<div class="mt-9" />
	<PurchaseSummary final={true} />
	<div class="text-center">
		<button on:click={close} class="btn btn-wide btn-primary rounded border-2 normal-case block m-auto">Continue Shopping</button>
	</div>
</ModalBase>
