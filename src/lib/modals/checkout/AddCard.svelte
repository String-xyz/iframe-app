<script lang="ts">
	import { onMount } from 'svelte';
	import { modalManager, selectedCard } from '$lib/stores';
	import { numericFilter, capInputLength } from '$lib/utils';

	import ModalBase from '../ModalBase.svelte';
	import StyledButton from '$lib/components/shared/StyledButton.svelte';

	import Purchase from './Purchase.svelte';
	import StyledInput from '$lib/components/shared/StyledInput.svelte';
	import CardFailed from './CardFailed.svelte';

	type Stage = 'card' | 'billing';

	let stage: Stage = "card";

	let cardHeader = "Pay with a Debit or Credit Card";
	let billingHeader = "Billing Address";

	let disabled = true;

	$: {
		if (stage === "card") {
			disabled = !isPaymentInfoValid;
		} else {
			disabled = !isValidBillingInfo;
		}
	}

	$: currentHeader = stage === "card" ? cardHeader : billingHeader;

	$: currentAction = stage === "card" ? handleCardDetails : finishAddCard;

	let shouldSaveCard = false;

	// Checkout
	let checkout: any;

	let isPaymentInfoValid = false;
	let isCardVendorAccepted = true;
	let cardVendor = "";

	let nameInput: string;

	// Billing inputs
	let addressInput: string;
	let cityInput: string;
	let zipInput: string;
	let stateInput: string;

	let isAddressValid = true;
	let isCityValid = true;
	let isZipValid = true;
	let isStateValid = true;

	const CHECKOUT_PK = import.meta.env.VITE_CHECKOUT_PUBLIC_KEY;

	onMount(async () => {
		if (!CHECKOUT_PK) return;
		// @ts-ignore
		checkout = window.Frames;
		checkout.init({
			publicKey: CHECKOUT_PK,
			acceptedPaymentMethods: ["Visa", "Mastercard", "American Express", "Discover"],
			cardTokenized: onCardTokenized,
			cardValidationChanged: validateCardInfo,
			paymentMethodChanged: onVendorChanged,
			style: {
				base: {
					color: "#0C1116",
					fontSize: "16px",
					fontFamily: "sans-serif",
					letterSpacing: "0.025em",
				},
				invalid: {
					color: "#E25950",
				},
				autofill: {
					backgroundColor: "#FFFFFF",
				},
				placeholder: {
					base: {
						color: "#8A98A9",
					}
				}
			}
		});
	});

	const validateCardInfo = (info: any) => {
		isPaymentInfoValid = info.isValid && nameInput != "" && isCardVendorAccepted;
	}

	const onVendorChanged = (data: any) => {
		isCardVendorAccepted = data.isPaymentMethodAccepted;
		cardVendor = data.paymentMethod;
	}

	const submitCard = () => {
		checkout.cardholder = {
			name: nameInput,
			billingAddress: {
				addressLine1: addressInput,
				city: cityInput,
				zip: zipInput,
				state: stateInput,
				country: "US"
			}
		}
		checkout.submitCard();
	}

	const onCardTokenized = async (data: any) => {
		// selectedCard.set({ token: data.token, scheme: data.scheme, last4: data.last4 });
	}

	const isValidBillingInfo = () => {
		isAddressValid = addressInput != "";
		isCityValid = cityInput != "";
		isZipValid = zipInput.length === 5;
		isStateValid = stateInput != "";

		return isAddressValid && isCityValid && isZipValid && isStateValid;
	}

	const handleCardDetails = () => {
		stage = "billing";
	}

	const finishAddCard = () => {
		if (!isValidBillingInfo) return;
		
		try {
			submitCard();
			modalManager.set(Purchase);
		} catch (e) {
			modalManager.set(CardFailed);
		}

	}

	const back = () => {
		modalManager.set(Purchase);
	}

</script>

<ModalBase>
	<div class="main flex flex-col justify-center items-center">
		<header class="flex items-center w-full mb-8">
			<button on:click={back} class="mr-2">
				<img src="/assets/back_arrow.svg" alt="back"/>
			</button>
			<h1 class="text-2xl whitespace-nowrap font-semibold">Fill in card details</h1>
		</header>

		<div class="flex flex-col border border-gray-blue-20 rounded-2xl w-full mb-12 p-4">
			<p class="text-gray-blue-100 text-lg whitespace-nowrap font-semibold mb-4">{currentHeader}</p>
			{#if stage === "card"}
				<div class="text-gray-blue-60 font-medium mb-6">
					<div class="mb-2 pt-2">
						<label class="ml-1" for="card-number-frame">Card number</label>
						<div id="card-number-frame" class="input input-bordered border-2 mt-2 card-number-frame" />
						<p class="text-sm text-red-500" class:hidden={!cardVendor || isCardVendorAccepted}>Sorry. We don't accept {cardVendor}</p>
					</div>
					<div class="flex flex-col mb-2 pt-2">
						<label class="ml-1" for="name-input">Name on card</label>
						<input
							id="name-input"
							class="input input-bordered border-2 text-gray-blue-100 focus:outline-none mt-2 h-12"
							placeholder="Name"
							bind:value={nameInput}
							required
						/>
					</div>
					<div class="flex justify-between">
						<div class="mr-4 pt-2">
							<label class="ml-1" for="expiry-date-frame">Expiry date</label>
							<div id="expiry-date-frame" class="input input-bordered border-2 mt-2 expiry-date-frame" />
						</div>
						<div class="pt-2">
							<label class="ml-1" for="cvv-frame">Security code</label>
							<div id="cvv-frame" class="input input-bordered border-2 mt-2 cvv-frame" />
						</div>
					</div>
				</div>
			{:else if stage === "billing"}
				<div class="mb-6">
					<StyledInput
						label="Address Line 1"
						placeholder="Address Line 1"
						className="mb-2"
						borderError={!isAddressValid}
						bind:val={addressInput}
						keypress={(e) => capInputLength(e, addressInput, 100)}
						autocomplete="address-line1"
						required
					/>
					<div class="flex justify-between mb-2">
						<StyledInput
							label="City"
							placeholder="City"
							className="w-1/2 mr-2"
							borderError={!isCityValid}
							bind:val={cityInput}
							keypress={(e) => capInputLength(e, cityInput, 100)}
							autocomplete="address-level2"
							required
						/>
						<StyledInput
							label="Zip code"
							placeholder="Zip code"
							pattern="[0-9]"
							className="w-1/2"
							borderError={!isZipValid}
							bind:val={zipInput}
							keypress={(e) => numericFilter(e, zipInput, 5)}
							autocomplete="postal-code"
							required
						/>
					</div>
					<div class="flex justify-between">
						<StyledInput
							label="State"
							placeholder="State"
							className="w-1/2 mr-2"
							bind:val={stateInput}
							required
						/>
						<StyledInput
							label="Country"
							placeholder="USA"
							className="w-1/2"
							disabled
						/>
					</div>
				</div>
			{/if}

			<label class="flex items-center cursor-pointer w-1/2">
				<input
					type="checkbox"
					class="toggle toggle-primary mr-4"
					bind:checked={shouldSaveCard}
				/>
				<span
					class="text-gray-blue-100 font-semibold inline"
					class:text-primary={shouldSaveCard}
				>
					Securely save this card
				</span>
			</label>
		</div>

		<StyledButton
			action={currentAction}
			{disabled}
		>
			Continue
		</StyledButton>
	</div>
</ModalBase>
