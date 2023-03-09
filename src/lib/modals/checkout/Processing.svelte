<script lang="ts">
	import ModalBase from '../ModalBase.svelte';
	import NFTDetails from '$lib/components/checkout/NFTDetails.svelte';
	import Spinner from '$lib/components/checkout/Spinner.svelte';

	import PurchaseSuccess from './PurchaseSuccess.svelte';
	import PurchaseFailed from './PurchaseFailed.svelte';

	import { onMount } from 'svelte';
	import { sdkService } from '$lib/services';
	import { card, finalQuote, modalManager, txID, txURL } from '$lib/stores';

	onMount(async () => {
		if (!$finalQuote) return;

		const quote = {
			...$finalQuote,
			...{ cardToken: $card?.token ?? '' }
		};

		try {
			const transaction = await sdkService.transact(quote);

			$txID = transaction?.txId;
			$txURL = transaction?.txUrl;
			modalManager.set(PurchaseSuccess);
		} catch (e) {
			console.error('transact error', e);
			modalManager.set(PurchaseFailed);
		}

		$card = null;
	});

</script>

<ModalBase title="Processing" type="checkout">
	<NFTDetails />
	<div class="mt-9" />
	<Spinner />
	<div class="mt-6 text-center">
		<p>We are purchasing this item. This procedure may take some time.</p>
		<p class="mt-2">You will not be charged until the blockchain transaction is completed</p>
	</div>
</ModalBase>
