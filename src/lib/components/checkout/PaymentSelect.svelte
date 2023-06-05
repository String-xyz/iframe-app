<script lang="ts">
	import { modalManager } from "$lib/stores";
	import { numericFilter } from "$lib/utils";

	import StyledButton from "../shared/StyledButton.svelte";

	import AddCard from "$lib/modals/checkout/AddCard.svelte";

	let card = {
		token: undefined,
		vendor: undefined,
		last4: undefined,
		exp_month: undefined,
		exp_year: undefined,
		isSavedCard: true,
	}

	let cvvInput = '';

	let cvvFocused = false;

	let isCvvValid = true;

	const assetPath = "/assets/card/";

	const acceptedVendors = ["visa", "mastercard", "discover", "amex"];

	const getCardIcon = (scheme: string) => {
		return (acceptedVendors.includes(scheme.toLowerCase()) ? scheme : "card") + ".svg";
	}

	const gotoAddCard = () => {
		modalManager.set(AddCard);
	}

</script>

<div class="flex justify-between w-full">
	<div class="flex box w-3/4">
		<StyledButton
			className="btn-primary-special"
			action={gotoAddCard}
		>
			Add New Card
		</StyledButton>
	</div>
	{#if card?.isSavedCard}
		<div
			class="flex box justify-between w-1/4 ml-4"
			class:border-primary={cvvFocused}
			class:border-error={!isCvvValid}
		>
			<input
				class="cvv-input"
				placeholder="CVV"
				pattern="[0-9]"
				bind:value={cvvInput}
				on:keypress={(e) => numericFilter(e, cvvInput, 4)}
				on:paste|preventDefault={() => false}
				on:focus={() => cvvFocused = true}
				on:blur={() => cvvFocused = false}
			/>
			<img src="/assets/cards/card.svg" alt="card" class="inline" width="32px" height="32px" />
		</div>
	{/if}
</div>

<style lang='postcss'>
	.box {
		@apply border;
		@apply rounded-2xl;
		@apply border-gray-blue-20;
		@apply p-4;
	}

	.cvv-input {
		@apply text-gray-blue-100;
		@apply font-medium;
		border: none;
		outline: none;
		width: 100%;
	}

	::placeholder {
		@apply text-gray-blue-40;
	}
</style>