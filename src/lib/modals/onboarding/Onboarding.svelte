<script lang="ts">
	import ModalBase from './ModalBase.svelte';
	import StyledButton from '$lib/components/shared/StyledButton.svelte';
	import Address from '$lib/components/onboarding/Address.svelte';

	import VerifyEmailForm from './VerifyEmailForm.svelte';
	import OrderDetails from '../checkout/OrderDetails.svelte';
	import VerifyDevice from './VerifyDevice.svelte';

	import { onMount } from 'svelte';
	import { modalManager, contractPayload, userId } from '$lib/stores';
	import { apiClient, loginOrCreateUser } from '$lib/services';

	let action: () => void;
	let actionText = '';

	onMount(async () => {
		// A prerequisite for this modal to be shown is that there is always a wallet connected
		if (!(await isUserLoggedIn())) {
			actionText = 'Authorize Wallet';
			action = authorizeWallet;
			return;
		}

		// user authorized
		handleUserAuthorized();
	});

	const handleUserAuthorized = async () => {
		try {
			const user = await apiClient.getUserStatus($userId);
			// get user status
			if (user.status === 'email_verified') {
				sendToCheckout();
				return;
			}

			sendToVerify();
		} catch (err: any) {
			console.log('Could not get user: ' + err.message);
			action = authorizeWallet;
			actionText = 'Authorize Wallet';
		}
	};

	const authorizeWallet = async () => {
		try {
			const { user } = await loginOrCreateUser($contractPayload.userAddress);
			userId.set(user.id);

			if (user.status !== 'email_verified') return sendToVerify();
			else return sendToCheckout();
		} catch (err: any) {
			console.log('Could not authorize wallet: ' + err.message);
			handleAuthError(err);
		}
	};

	function handleAuthError(err: any) {
		if (err.code === 'UNPROCESSABLE_ENTITY') return sendToDeviceVerify();

		// unhandled error. Improve the styling of this error message
		alert('Oops, there seems to be a problem. Please, try again later.');
	}

	const sendToVerify = async () => {
		modalManager.set(VerifyEmailForm);
	};

	const sendToCheckout = () => {
		modalManager.set(OrderDetails);
	};

	const sendToDeviceVerify = () => {
		modalManager.set(VerifyDevice);
	};

	async function isUserLoggedIn() {
		if (!$userId) return false;
		// we always request a new access token on iframe load. If the refresh token is invalid, the user is not logged in
		try {
			await apiClient.refreshToken();
			return true;
		} catch (e) {
			console.log('Refresh token is invalid. User is not logged in.');
			return false;
		}
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
