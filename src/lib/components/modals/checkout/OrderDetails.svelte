<script lang="ts">
	import ModalBase from './ModalBase.svelte';
	import { modalManager } from '$lib/stores';
	import type { NFT } from '$lib/types';

	import NFTDetails from '$lib/components/NFTDetails.svelte';
	import PurchaseSummary from '$lib/components/PurchaseSummary.svelte';
	import OrderConfirmation from './OrderConfirmation.svelte';

	export let item: NFT;

	const back = () => {
		modalManager.set(null);
	};

	const next = () => {
		modalManager.set(OrderConfirmation);
	};
</script>

<ModalBase title="Pay with Card">
	<NFTDetails {item} />
	<PurchaseSummary {item} />
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
