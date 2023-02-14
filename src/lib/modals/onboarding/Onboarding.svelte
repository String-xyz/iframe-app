<script lang="ts">
	import ModalBase from '../ModalBase.svelte';
	import StyledButton from '$lib/components/shared/StyledButton.svelte';
	import Address from '$lib/components/onboarding/Address.svelte';

	import VerifyEmailForm from './VerifyEmailForm.svelte';
	import OrderDetails from '../checkout/OrderDetails.svelte';
	import VerifyDevice from './VerifyDevice.svelte';

	import { onMount } from 'svelte';
	import { modalManager, __user } from '$lib/stores';
	import { sdkService } from '$lib/services';

	let action = authorizeWallet; // default component behavior: Show Authorize Wallet button
	let actionText = 'Authorize Wallet';

	onMount(async () => {
		// By default, the component shows the Authorize Wallet button
		// If the user is logged in, the user is sent to the next step
		// The SDK loads the iframe with the user id set if the user is logged in
		if ($__user.id) return handleUserAuthorized();
	});

	const handleUserAuthorized = async () => {
		if ($__user.status === 'email_verified') return sendToCheckout();
		else sendToEmailVerify();
	};

	async function authorizeWallet() {
		try {
			const { user } = await sdkService.requestAuthorization($__user.walletAddress);
			// set user store
			$__user.id = user.id;
			$__user.status = user.status;

			if (user.status !== 'email_verified') return sendToEmailVerify();
			else return sendToCheckout();
		} catch (err: any) {
			handleAuthError(err);
		}
	}

	function handleAuthError(err: any) {
		if (err.code === 'INVALID_EMAIL') return sendToEmailVerify();
		if (err.code === 'UNPROCESSABLE_ENTITY') return sendToDeviceVerify();

		// unhandled error. Improve the styling of this error message
		alert('Oops, there seems to be a problem. Please, try again later.');
	}

	const sendToEmailVerify = async () => {
		modalManager.set(VerifyEmailForm);
	};

	const sendToCheckout = () => {
		modalManager.set(OrderDetails);
	};

	const sendToDeviceVerify = () => {
		modalManager.set(VerifyDevice);
	};
</script>

<ModalBase title="Pay with String" type="onboarding">
	<p class="mt-3 text-lg">
		String makes it easy to purchase digital assets with your credit or debit card. Log-in with your
		wallet to complete your purchase. This is where we are going to send blockchain items when
		purchased.
	</p>
	<div class="wallet mt-5 flex justify-center">
		<div class="flex flex-col justify-center">
			<img
				class="mb-6"
				width="150px"
				height="36px"
				src="/assets/string_text_logo.svg"
				alt="String"
			/>
			<Address />
		</div>
	</div>
	<div class="flex justify-center mt-7 mb-3">
		<StyledButton {action}>{actionText}</StyledButton>
	</div>
</ModalBase>

<style>
	.wallet {
		background-color: #dff1ff;
		border-radius: 8px;
		height: 130px;
	}
</style>
