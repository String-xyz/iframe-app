<script lang="ts">
	import { modalManager, cardList, selectedCard } from "$lib/stores";
	import { capitalize, formatExpiryDate, numericFilter } from "$lib/utils";

	import StyledButton from "../shared/StyledButton.svelte";

	import AddCard from "$lib/modals/checkout/AddCard.svelte";

	export let cvvInput = '';

	let cvvFocused = false;

	let isCvvValid = true;

	let isDDOpen = false;

	const acceptedVendors = ["visa", "mastercard", "discover", "amex"];

	const cardAssetPath = "/assets/cards/"
	const ddAssetPath = "/assets/dropdown/";

	// [src, alt text]
	const radioChecked = [ddAssetPath + "radio_checked.svg", "radio-checked"];
	const radioUnchecked = [ddAssetPath + "radio_unchecked.svg", "radio-unchecked"];

	$: arrowIcon = ddAssetPath + (isDDOpen ? "up_arrow.svg" : "down_arrow.svg");

	const getCardIcon = (scheme: string) => {
		return cardAssetPath + (acceptedVendors.includes(scheme.toLowerCase()) ? scheme : "card") + ".svg";
	}

	const toggleDropdown = () => {
		isDDOpen = !isDDOpen;
	}

	const gotoAddCard = () => {
		modalManager.set(AddCard);
	}

</script>

<div class="flex justify-between w-full">
	{#if $cardList && $cardList.length > 0}
		<div class="flex flex-col box w-3/4 p-4">
			{#each $cardList as card, i}
				{@const active = card == $selectedCard}
				<div class="flex justify-between items-center">
					<div class="flex">
						<img src={active ? radioChecked[0] : radioUnchecked[0]} alt={active ? radioChecked[1] : radioUnchecked[1]} />
						<img src={getCardIcon(card.scheme)} alt={card.scheme} class="mx-3"/>
						<div class="flex flex-col">
							<span class="text-gray-blue-80 font-semibold mb-1">{capitalize(card.scheme)} *{card.last4}</span>
							{#if !card.expired}
								<span class="text-gray-blue-40 text-sm font-medium">Expires on {formatExpiryDate(card)}</span>
							{:else}
								<span class="text-error text-sm font-medium">Expired {formatExpiryDate(card)}</span>
							{/if}
						</div>
					</div>
					{#if i == 0}
						<button on:click={toggleDropdown}>
							<img src={arrowIcon} alt="arrow" />
						</button>
					{/if}
				</div>
			{/each}
			{#if isDDOpen}
				<div class="flex justify-center w-full mt-4">
					<StyledButton
						className="btn-primary-special"
						action={gotoAddCard}
					>
					Add New Card
					</StyledButton>
				</div>
			{/if}
		</div>
	{:else}
		<StyledButton
			className="btn-primary-special !w-3/4"
			action={gotoAddCard}
		>
		Add New Card
		</StyledButton>
	{/if}
	{#if $selectedCard?.isSavedCard || false}
		<div
			class="flex box justify-between w-1/4 h-20 ml-4"
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