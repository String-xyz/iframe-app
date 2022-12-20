<script>
	import ModalBase from "./ModalBase.svelte";
	import StyledButton from "$lib/components/shared/StyledButton.svelte";
	import Address from "$lib/components/onboarding/Address.svelte";

	import VerifyEmailForm from "./VerifyEmailForm.svelte";
	import OrderDetails from "../checkout/OrderDetails.svelte";

	import { modalManager, contractPayload, login, accessToken } from "$lib/stores";
	import { onMount } from "svelte";

	const ENV = import.meta.env.VITE_ENV

	let action = () => {};

	let actionText = "Pay with String"

	onMount(async () => {
		// It goes to VerifyEmailForm for testing purposes
		if (ENV === 'dev') {
			await login($contractPayload.userAddress);

			if ($accessToken) {
				action = sendToVerify
				actionText = "Pay with String"
			} else {
				action = authorizeWallet
				actionText = "Authorize Wallet"
			}
		}

	})

	const authorizeWallet = () => {

	}

	const sendToVerify = () => {
		modalManager.set(VerifyEmailForm)
	}

	const sendToCheckout = () => {
		//TODO: When not in testing, if a device is known, send them directly to checkout
		modalManager.set(OrderDetails)
	}
</script>

<ModalBase title="Pay with String" size="size-onboard">
	<p class="mt-3 text-lg">String makes it easy to purchase digital assets with your credit or debit card. Log-in with your wallet to complete your purchase. This is where we are going to send blockchain items when purchased.</p>
	<div class="wallet mt-5 flex justify-center">
		<div class="flex flex-col justify-center">
			<img class="mb-6" width="150px" height="36px" src="/assets/string_text_logo.svg" alt="String" />
			<Address />
		</div>
	</div>
	<div class="flex justify-center mt-7">
		<StyledButton {action}>{actionText}</StyledButton>
	</div>
</ModalBase>

<style>
	.wallet {
		background-color:#DFF1FF;
		border-radius: 8px;
		height: 130px;
	}
</style>