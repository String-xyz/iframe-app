<script lang="ts">
	import ModalBase from '../ModalBase.svelte';
	import NFTDetails from '$lib/components/checkout/NFTDetails.svelte';
	import Spinner from '$lib/components/checkout/Spinner.svelte';

	import PurchaseSuccess from './PurchaseSuccess.svelte';
	import PurchaseFailed from './PurchaseFailed.svelte';

	import { onMount } from 'svelte';
	import { sdkService } from '$lib/services';
	import { card, finalQuote, modalManager, txID, txURL } from '$lib/stores';
	import type { ExecutionRequest } from '$lib/types';

	onMount(async () => {
		if (!$finalQuote) return;

		try {
			let executionRequest: ExecutionRequest = {
				quote: $finalQuote,
				paymentInfo: {
					cardToken: $card?.token ?? ''
				}

			}
			const transaction = await sdkService.transact(executionRequest);

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
