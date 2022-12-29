<script>
	import ModalBase from './ModalBase.svelte';
	import StyledButton from '$lib/components/shared/StyledButton.svelte';
	import Address from '$lib/components/onboarding/Address.svelte';
	import { ethers } from 'ethers';
	import VerifyEmailForm from './VerifyEmailForm.svelte';
	import OrderDetails from '../checkout/OrderDetails.svelte';

	import { modalManager, contractPayload, accessToken, userId } from '$lib/stores';
	import { createAnalyticsService, apiClient } from '$lib/services';
	import { onMount } from 'svelte';

	let action = () => {};

	let actionText = 'Pay with String';

	onMount(async () => {
		// get user status

		if ($accessToken) {
			// TODO: get user id from jwt

			// if the user is logged in, check if they have verified their email
			try {
				const { status } = await apiClient.getUserStatus($userId);
				if (status === 'email_verified') {
					sendToCheckout();
					return;
				}
				action = sendToVerify;
				actionText = 'Pay with String';
			} catch (e) {
				alert('Error getting user status: ' + e.message);
				action = authorizeWallet;
				actionText = 'Authorize Wallet';
			}
		} else {
			action = authorizeWallet;
			actionText = 'Authorize Wallet';
		}
	});

	const authorizeWallet = async () => {
		try {
			const provider = new ethers.providers.Web3Provider(window.ethereum);

			// connect wallet
			await window.ethereum.request({ method: 'eth_requestAccounts' });

			// get nonce from the api
			const walletAddress = $contractPayload.userAddress;
			const { nonce } = await apiClient.requestLogin(walletAddress);

			// sign nonce with wallet
			const signer = provider.getSigner();
			const signature = await signer.signMessage(nonce);

			// get fingerprint data
			const analyticsService = createAnalyticsService();
			const visitorData = await analyticsService.getVisitorData();

			// try to create user, if user already exists, login
			try {
				const { user } = await apiClient.createUser(nonce, signature, visitorData);
				console.log('----- user created', user);
				sendToVerify();
				return;
			} catch (e) {
				if (e.code === 'CONFLICT') {
					console.log('----- user already exists', e);
					// user already exists
					const { user } = await apiClient.loginUser(nonce, signature, visitorData);
					console.log('----- user logged id', user);

					if (user.status !== 'email_verified') {
						sendToVerify();
						return;
					}

					sendToCheckout();
					return;
				}

				throw e;
			}
		} catch (e) {
			console.log('----- error', e);
			alert('TODO: Show an error screen');
		}
	};

	const sendToVerify = () => {
		modalManager.set(VerifyEmailForm);
	};

	const sendToCheckout = () => {
		//TODO: When not in testing, if a device is known, send them directly to checkout
		modalManager.set(OrderDetails);
	};
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
