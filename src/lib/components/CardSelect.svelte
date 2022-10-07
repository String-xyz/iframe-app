<script lang="ts">
	import { card, modalManager } from '$lib/stores';
	import type { Card } from '$lib/types';
	import CardDetails from './modals/checkout/CardDetails.svelte';

	const changeCard = () => {
		card.set(<Card>{})
		modalManager.set(CardDetails);	
	}

	const showCardDetails = () => {
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
		<span class="text-primary text-sm cursor-pointer" on:click={showCardDetails}>
			<img class="inline mr-3" src="/assets/card_icon.svg" alt="card_icon" />
			Add Card
		</span>
	</div>
{/if}
