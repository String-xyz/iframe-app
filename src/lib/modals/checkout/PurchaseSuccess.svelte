<script lang="ts">
	import ModalBase from './ModalBase.svelte';
	import { modalManager } from '$lib/stores';

	import PurchaseSummary from '$lib/components/checkout/PurchaseSummary.svelte';
	import NFTDetails from '$lib/components/checkout/NFTDetails.svelte';

	const clear = () => {
		modalManager.set(null);
	};

</script>

<ModalBase title="You purchased this item!">
	<NFTDetails />
	<div class="mt-9" />
	<PurchaseSummary final={true} />
	<div class="text-center">
		<a href="/">
			<button on:click={clear} class="btn btn-wide btn-primary rounded border-2 normal-case block m-auto">Continue Shopping</button>
		</a>
		<a href="/nfts/collection">
			<button on:click={clear} class="btn btn-wide btn-primary btn-outline rounded border-2 normal-case block mt-3 m-auto ">My Collection</button>
		</a>
	</div>
</ModalBase>
