<script lang="ts">
	import ModalBase from './ModalBase.svelte';
	import { modalManager } from '$lib/stores';
	import type { NFT } from '$lib/types';

	import NFTDetails from '$lib/components/checkout/NFTDetails.svelte';
	import OrderConfirmation from './OrderConfirmation.svelte';

	export let item: NFT;

	const back = () => {
		modalManager.set(OrderConfirmation);
	};
</script>

<ModalBase title="Purchase failed">
	<NFTDetails {item} />
	<div class="divider" />
	<p class="text-red-500">We are unable to complete your purchase due to an API error</p>
	<div class="text-center mt-6">
		<button class="btn btn-wide btn-primary rounded border-2 normal-case" on:click={back}>Try Again</button>
		<button class="btn btn-wide btn-outline btn-primary rounded border-2 normal-case mt-3">Pay w/ Crypto</button>
	</div>
	
</ModalBase>
