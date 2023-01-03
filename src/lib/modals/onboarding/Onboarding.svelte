<script>
	import ModalBase from './ModalBase.svelte';
	import StyledButton from '$lib/components/shared/StyledButton.svelte';
	import Address from '$lib/components/onboarding/Address.svelte';
	import { ethers } from 'ethers';
	import VerifyEmailForm from './VerifyEmailForm.svelte';
	import OrderDetails from '../checkout/OrderDetails.svelte';

	import { modalManager, userStore, contractPayload } from '$lib/stores';
	import { createLocationService, apiClient } from '$lib/services';
	import { onMount } from 'svelte';

	// default action: Authorize Wallet
	let action = authorizeWallet;
	let actionText = 'Authorize Wallet';

	// store vars
	let userId = '';

	userStore.userId.subscribe((value) => (userId = value));

	// TODO: Logout function: Make an api call to logout endpoint, clear localStorage, disconnect wallet
	// TODO: Listen to wallet lock events. On lock call logout function

	onMount(async () => {
		// A prerequisite for this modal to be shown is that there is always a wallet connected
		console.log('--- Wallet is already connected');

		if (!(await isUserLoggedIn())) {
			actionText = 'Authorize Wallet';
			action = authorizeWallet;
			return;
		}

		// user authorized
		actionText = 'Pay With String';
		action = payWithString;
		return;
	});

	async function payWithString() {
		console.log('Pay with String action');

		//This is redundant, we already know the user is logged in
		let isLoggedIn = await isUserLoggedIn();
		if (!isLoggedIn) {
			action = authorizeWallet;
			actionText = 'Authorize Wallet';
			return;
		}

		try {
			const user = await apiClient.getUserStatus(userId);
			// get user status
			if (user.status === 'email_verified') {
				sendToCheckout();
				return;
			}

			sendToVerify();
		} catch (e) {
			console.log('----- error', e);
			alert('TODO: Show an error screen'); // TODO: Use bootstrap notifications instead
		}
	}
	async function authorizeWallet() {
		try {
			const provider = new ethers.providers.Web3Provider(window.ethereum);

			// get nonce from the api
			const walletAddress = $contractPayload.userAddress;
			apiClient._setWalletAddress(walletAddress); // this is a temporary fix
			const { nonce } = await apiClient.requestLogin(walletAddress);

			// sign nonce with wallet
			const signer = provider.getSigner();
			const signature = await signer.signMessage(nonce);

			// get fingerprint data
			const locationService = createLocationService();
			const visitorData = await locationService.getVisitorData();

			// try to create user, if user already exists, login
			try {
				const { user } = await apiClient.createUser(nonce, signature, visitorData);
				console.log('----- user created', user);
				// set user id in store
				userStore.userId.set(user.id);
				sendToVerify();
				return;
			} catch (e) {
				if (e.code !== 'CONFLICT') {
					throw e;
				}

				console.log('----- user already exists', e);
				// user already exists
				const { user } = await apiClient.loginUser(nonce, signature, visitorData);
				console.log('----- user logged id', user);
				userStore.userId.set(user.id);
				// this is redundant
				if (user.status !== 'email_verified') {
					sendToVerify();
					return;
				}

				sendToCheckout();
				return;
			}
		} catch (e) {
			console.log('----- error', e);
			alert('TODO: Show an error screen'); // TODO: Use bootstrap notifications instead
		}
	}

	const sendToVerify = () => {
		modalManager.set(VerifyEmailForm);
	};

	const sendToCheckout = () => {
		//TODO: When not in testing, if a device is known, send them directly to checkout
		modalManager.set(OrderDetails);
	};

	async function isUserLoggedIn() {
		// For now to make sure a user is logged in we sent a request to the api. This is not ideal
		// because we are making an extra request to the api. We should be able to check the userStore
		if (userId !== '') {
			return false;
		}

		try {
			await apiClient.getUserStatus(userId);
			return true;
		} catch (e) {
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
