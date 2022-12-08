<script lang="ts">
	import ModalBase from './ModalBase.svelte';
	import {
		card,
		finalQuote,
		transact,
		modalManager,
		txID,
		txURL,
	} from '$lib/stores';

	import { onMount } from 'svelte';

	import NFTDetails from '$lib/components/checkout/NFTDetails.svelte';
	import Spinner from '$lib/components/checkout/Spinner.svelte';
	import PurchaseSuccess from './PurchaseSuccess.svelte';
	import PurchaseFail from './PurchaseFail.svelte';

	onMount(async () => {
		if (!$finalQuote) return;
		
		const transaction = await transact($finalQuote)
		$txURL = transaction?.txURL
		$txID = transaction?.txID
		$card = null

		modalManager.set(txURL ? PurchaseSuccess : PurchaseFail);
	});
</script>

<ModalBase title="Processing">
	<NFTDetails />
	<div class="mt-9"></div>
	<Spinner />
	<div class="mt-6 text-center">
		<p>We are purchasing this item. This procedure may take some time.</p>
		<p class="mt-2">You will not be charged until the blockchain transaction is completed</p>
	</div>
</ModalBase>
