<script lang="ts">
	import ModalBase from '../ModalBase.svelte';
	import StyledButton from '$lib/components/shared/StyledButton.svelte';

	import PurchaseSummary from '$lib/components/checkout/PurchaseSummary.svelte';
	import NFTDetails from '$lib/components/checkout/NFTDetails.svelte';
	
	import { modalManager } from '$lib/stores';
	import { sendEvent, Events } from '$lib/events';

	const close = () => {
		modalManager.set(null);
		sendEvent(Events.IFRAME_CLOSE)
	}
	
</script>

<ModalBase title="You purchased this item!" type="checkout">
	<NFTDetails />
	<div class="mt-9" />
	<PurchaseSummary final={true} />
	<div class="flex justify-center">
		<StyledButton action={close}>Continue Shopping</StyledButton>
	</div>
</ModalBase>
