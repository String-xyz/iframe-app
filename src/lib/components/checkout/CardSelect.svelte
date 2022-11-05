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

</script>

{#if $card?.token}
	<div class="flex justify-between mt-3">
		<span>Card number</span>
		<span>
			{$card.scheme} *{$card.last4}
			<img on:click={changeCard} class="inline ml-2 cursor-pointer" src="/assets/edit.svg" alt="change">
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
