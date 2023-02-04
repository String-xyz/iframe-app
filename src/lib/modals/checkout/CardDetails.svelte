<script lang="ts">
	import ModalBase from './ModalBase.svelte';
	import BackButton from '$lib/components/shared/BackButton.svelte';
	import StyledButton from '$lib/components/shared/StyledButton.svelte';

	import OrderConfirmation from './OrderConfirmation.svelte';

	import { onMount, onDestroy } from 'svelte';
	import { modalManager, card } from '$lib/stores';
	import { sdkService } from '$lib/services';

	const CHECKOUT_PK = import.meta.env.VITE_CHECKOUT_PUBLIC_KEY;

	let isPaymentInfoValid = false;
	let isCardVendorAccepted = true;
	let cardVendor = "";
	let checkout: any;

	onMount(async () => {
		if (!CHECKOUT_PK) return;
		// @ts-ignore
		checkout = window.Frames;
		checkout.init({
			publicKey: CHECKOUT_PK,
			acceptedPaymentMethods: ["Visa", "Mastercard", "American Express", "Discover"],
			cardTokenized: onCardTokenized,
			cardValidationChanged: validateInfo,
			paymentMethodChanged: onVendorChanged
		});

		await sdkService.requestQuoteStart();
	});

	onDestroy(() => {
		sdkService.requestQuoteStop();
	});

	const validateInfo = (info: any) => {
		isPaymentInfoValid = info.isValid;
	};

	const onVendorChanged = (data: any) => {
		isCardVendorAccepted = data.isPaymentMethodAccepted;
		cardVendor = data.paymentMethod;
	}

	const onCardTokenized = async (data: any) => {
		card.set({ token: data.token, scheme: data.scheme, last4: data.last4 });
		back();
	};

	const submitCard = () => {
		checkout.submitCard();
	};

	const back = () => {
		modalManager.set(OrderConfirmation);
	};
</script>

<ModalBase title="Add card details">
	<form on:submit|preventDefault={submitCard}>
		<div class="mt-4">
			<label for="card-number">Card number</label>
			<div class="input-container card-number mt-1">
				<div class="input input-bordered input-primary border-2 card-number-frame" />
			</div>
		</div>
		<p class="text-sm text-red-500" class:hidden={!cardVendor || isCardVendorAccepted}>Sorry. We don't accept {cardVendor}</p>

		<div class="mt-4">
			<label for="name">Name on card</label>
			<div class="name mt-1">
				<input class="input input-bordered border-2 w-full" placeholder="Name" required />
			</div>
		</div>
		<div class="flex justify-center">
			<div class="mt-4 mr-2">
				<label for="expiry-date">Expiry date</label>
				<div class="mt-1">
					<div class="input input-bordered border-2 expiry-date-frame" />
				</div>
			</div>
			<div class="mt-4">
				<label for="cvv">Security code</label>
				<div class="mt-1">
					<div class="input input-bordered border-2 cvv-frame" />
				</div>
			</div>
		</div>
		<div class="text-center mt-10">
			<StyledButton disabled={!isCardVendorAccepted || !isPaymentInfoValid} type="submit">Save</StyledButton>
			<BackButton {back} />
		</div>
	</form>
</ModalBase>

<style>
	label {
		font-size: 14px;
		line-height: 16px;
		color: #767676;
	}
</style>
