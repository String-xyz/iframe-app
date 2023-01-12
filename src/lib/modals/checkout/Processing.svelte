<script lang="ts">
	import ModalBase from './ModalBase.svelte';
	import { card, finalQuote, modalManager, txID, txURL } from '$lib/stores';
	import { sdkService } from '$lib/services';

	import { onMount } from 'svelte';

	import NFTDetails from '$lib/components/checkout/NFTDetails.svelte';
	import Spinner from '$lib/components/checkout/Spinner.svelte';
	import PurchaseSuccess from './PurchaseSuccess.svelte';
	import PurchaseFail from './PurchaseFail.svelte';

	onMount(async () => {
		if (!$finalQuote) return;

		const quote = {
			...$finalQuote,
			...{ cardToken: $card?.token ?? '' }
		};

		try {
			const transaction = await sdkService.transact(quote);

			$txID = transaction?.txID;
			$txURL = transaction?.txUrl;
			modalManager.set(PurchaseSuccess);
		} catch (e) {
			console.error('transact error', e);
			modalManager.set(PurchaseFail);
		}

		$card = null;
	});
</script>

<ModalBase title="Processing">
	<NFTDetails />
	<div class="mt-9" />
	<Spinner />
	<div class="mt-6 text-center">
		<p>We are purchasing this item. This procedure may take some time.</p>
		<p class="mt-2">You will not be charged until the blockchain transaction is completed</p>
	</div>
</ModalBase>
