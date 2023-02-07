<script lang="ts">
	import { card, modalManager } from '$lib/stores';
	import CardDetails from '$lib/modals/checkout/CardDetails.svelte';

	const changeCard = () => {
		$card = null
		modalManager.set(CardDetails);	
	}

	const showAddCard = () => {
		modalManager.set(CardDetails);
	};
	
	const assetPath = "/assets/card/";

	const acceptedVendors = ["visa", "mastercard", "discover", "amex"];

	const getCardIcon = (scheme: string) => {
		return (acceptedVendors.includes(scheme.toLowerCase()) ? scheme : "card") + ".svg";
	}
</script>

{#if $card?.token}
	<div class="flex justify-between mt-3">
		<span>Card number</span>
		<span class="">
			<img src={assetPath + getCardIcon($card.scheme)} alt={$card.scheme} width="30px" height="20px" class="inline mr-1"> *{$card.last4}
			<button on:click={changeCard} class="ml-2"><img src="/assets/edit.svg" alt="change" class="inline"></button>
		</span>
	</div>
{:else}
	<div class="flex justify-between mt-3">
		<span>Card number</span>
		<span class="text-primary text-sm cursor-pointer" on:click={showAddCard}>
			<img class="inline mr-3" src="/assets/card_icon.svg" alt="card_icon" />
			Add Card
		</span>
	</div>
{/if}
