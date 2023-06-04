<script lang="ts">
	import { modalManager } from "$lib/stores";

	import ModalBase from "../ModalBase.svelte";
	import StyledButton from "$lib/components/shared/StyledButton.svelte";

	import AddCard from "./AddCard.svelte";

	interface FailureInfo {
		title: string;
		description: string;
	}

	let cardFailure = { 
		ADD_CARD: {
			title: "Could Not Add Card",
			description: "Please try adding a different card or contact your card issuer for more information.",
		},
		ASSOCIATION: {
			title: "Card associated with another account",
			description: "Card already linked to another account. Please remove the card from the other account or use a different payment method.",
		}
	}

	let reason = cardFailure.ASSOCIATION;


	const back = () => {
		modalManager.set(AddCard);
	}

</script>

<ModalBase>
	<div class="main flex flex-col justify-center items-center text-center">
		<img src="/assets/headers/card_failed.svg" alt="failure" class="mb-6" />
		<h1 class="text-3xl font-semibold mb-4">{reason.title}</h1>
		<p class="text-gray-blue-60 text-lg font-medium mb-12">
			{reason.description}
		</p>

		<StyledButton
			action={back}
		>
			Add a New Card
		</StyledButton>
	</div>
</ModalBase>