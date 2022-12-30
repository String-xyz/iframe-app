<script lang='ts'>
	import ModalBase from './ModalBase.svelte';
	import StyledButton from '$lib/components/shared/StyledButton.svelte';
	import Address from '$lib/components/onboarding/Address.svelte';

	import VerifyEmailForm from './VerifyEmailForm.svelte';
	import OrderDetails from '../checkout/OrderDetails.svelte';
	import VerifyDevice from './VerifyDevice.svelte';

	import { onMount } from 'svelte';
	import { modalManager, contractPayload, userId } from '$lib/stores';
	import { apiClient, AuthState, login } from '$lib/services';

	let action = () => {};

	let actionText = 'Pay with String';

	onMount(async () => {
		// if the user is logged in, check if they have verified their email
		try {
			if (!$userId) throw new Error('User is not logged in');
			const { status } = await apiClient.getUserStatus($userId);
			if (status === 'email_verified') {
				sendToCheckout();
				return;
			}
			action = sendToVerify;
			actionText = 'Pay with String';
		} catch (err: any) {
			console.log('Could not get user: ' + err.message);
			action = authorizeWallet;
			actionText = 'Authorize Wallet';
		}
	});

	const authorizeWallet = async () => {
		const { state } = await login($contractPayload.userAddress);
		console.log(state)
		switch (state) {
			case AuthState.AUTHORIZED:
				sendToCheckout();
			break;

			case AuthState.EMAIL_UNVERIFIED:
				sendToVerify();
			break;

			case AuthState.DEVICE_UNVERIFIED:
				sendToDeviceVerify();
			break;

		}
	};

	const sendToVerify = () => {
		modalManager.set(VerifyEmailForm);
	};

	const sendToCheckout = () => {
		modalManager.set(OrderDetails);
	};

	const sendToDeviceVerify = () => {
		modalManager.set(VerifyDevice);
	}

</script>

<ModalBase title="Pay with String" size="size-onboard">
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
	<div class="flex justify-center mt-7">
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
