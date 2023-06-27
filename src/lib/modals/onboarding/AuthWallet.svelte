<script lang="ts">
	import { onMount } from 'svelte';
	import { modalManager, __user, userEmailPreview, cardList, selectedCard } from '$lib/stores';
	import { sdkService } from '$lib/services';

	import GetStarted from './GetStarted.svelte';
	import Purchase from '../checkout/Purchase.svelte';
	import VerifyDevice from './VerifyDevice.svelte';

	onMount(async () => {
		// By default, the component shows the Authorize Wallet button
		// If the user is logged in, the user is sent to the next step
		// The SDK loads the iframe with the user id set if the user is logged in
		if ($__user.id) return handleUserAuthorized();

		await authorizeWallet();
	});

	const handleUserAuthorized = async () => {
		if ($__user.status === 'email_verified') return sendToCheckout();
		else sendToEmailVerify();
	}

	async function authorizeWallet() {
		try {
			const { user } = await sdkService.requestAuthorization($__user.walletAddress);
			// set user store
			$__user.id = user.id;
			$__user.status = user.status;

			if (user.status !== 'email_verified') return sendToEmailVerify();
			else return sendToCheckout();
		} catch (err: any) {
			await handleAuthError(err);
		}
	}

	async function handleAuthError(err: any) {
		if (err.code === 'INVALID_EMAIL') return sendToEmailVerify();
		if (err.code === 'UNPROCESSABLE_ENTITY') return await sendToDeviceVerify();

		// unhandled error. Improve the styling of this error message
		alert('An unexpected error has occurred. Please try again.');
	}

	const requestDeviceVerification = async () => {
		try {
			const { status } = await sdkService.requestDeviceVerification($__user.walletAddress);
				
			if (status === 'verified') {
				sendToCheckout();
			}
		} catch (e: any) {
			console.error(e);
			alert("Something went wrong. Please try again.")
		}
	}

	const sendToEmailVerify = async () => {
		modalManager.set(GetStarted);
	}

	const sendToCheckout = async () => {
		const { cards } = await sdkService.getSavedCards();

		for (const savedCard of cards) {
			$cardList.push({
				cardId: savedCard.id,
				scheme: savedCard.scheme,
				last4: savedCard.last4,
				expiryMonth: savedCard.expiryMonth,
				expiryYear: savedCard.expiryYear,
				expired: savedCard.expired,
				isSavedCard: true
			});
		}

		$selectedCard = $cardList[0];

		modalManager.set(Purchase);
	}

	const sendToDeviceVerify = async () => {
		const { email } = await sdkService.getUserEmailPreview($__user.walletAddress);
		$userEmailPreview = email;

		modalManager.set(VerifyDevice);
		await requestDeviceVerification();
	}
</script>