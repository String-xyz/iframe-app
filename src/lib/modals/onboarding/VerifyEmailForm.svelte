<script lang="ts">
	import ModalBase from '../ModalBase.svelte';

	import BackButton from '$lib/components/shared/BackButton.svelte';
	import StyledButton from '$lib/components/shared/StyledButton.svelte';
	import StyledInput from '$lib/components/shared/StyledInput.svelte';

	import ResendEmailLink from './ResendEmailLink.svelte';
	import Onboarding from './Onboarding.svelte';
	import OrderDetails from '../checkout/OrderDetails.svelte';

	import { z } from 'zod';
	import { __user, modalManager } from '$lib/stores';
	import { sdkService } from '$lib/services';

	let tosAgreement = false;
	let firstNameInput = '';
	let lastNameInput = '';
	let emailInput = '';

	let isFNValid = true;
	let isLNValid = true;
	let isEmailValid = true;
	let isTOSValid = true;

	const emailSchema = z.string().trim().email();
	const nameSchema = z.string().min(1);

	async function requestEmailVerification(email: string) {
		/**
		 * Due to the actual implementation of the email verification, the endpoint waits for the user to click on the link in the email
		 * This is not ideal and will be change in the future. For now, we immediately redirect the user to the next modal and wait for a response
		 * If the response is a success, we allow the user to continue with the checkout process
		 * if the response is an error, we go back to the previous modal
		 */

		next(); // first go next until we solve the endpoint waiting time

		try {
			if (!$__user.id) throw new Error('User ID is not defined');

			await sdkService.requestEmailVerification($__user.id, email);
			modalManager.set(OrderDetails);
		} catch (e: any) {
			// if there's an error always go back to the previous modal
			back();

			if (e.code === 'CONFLICT') return alert('This email is already verified');
			if (e.code === 'LINK_EXPIRED') return alert('The link has expired. Please, try again.');

			alert('An unexpected error has occurred. Please try again.');
		}
	}

	const handleVerify = async () => {
		if (!isValidInput()) return;
		if (!$__user.id) return;

		const userUpdate = {
			walletAddress: $__user.walletAddress,
			firstName: firstNameInput,
			lastName: lastNameInput
		}

		await sdkService.updateUserName($__user.id, userUpdate);

		$__user.email = emailInput;
		await requestEmailVerification(emailInput);
	};

	const isValidInput = () => {
		isEmailValid = emailSchema.safeParse(emailInput).success;
		isFNValid = nameSchema.safeParse(firstNameInput).success;
		isLNValid = nameSchema.safeParse(lastNameInput).success;
		isTOSValid = tosAgreement;

		return isEmailValid && isFNValid && isLNValid && isTOSValid;
	};

	function back() {
		modalManager.set(Onboarding);
	}

	function next() {
		modalManager.set(ResendEmailLink);
	}

	//TODO: We want the error to be removed when the field is empty
	// const checkEmailEmpty = () => {
	// 	if (emailInput.length == 0) {
	// 		isEmailValid = true;
	// 	}
	// }
</script>

<ModalBase title="Verify your email" type="onboarding">
	<form on:submit|preventDefault={handleVerify}>
		<p class="text-xl mt-5">
			To proceed, we'll need a bit of information and to verify your email.
		</p>
		<div class="mt-5">
			<div class="flex justify-between">
				<StyledInput
					label="First Name"
					bind:val={firstNameInput}
					className="w-64"
					borderError={!isFNValid}
					placeholder="First name" 
					autofocus
					required
				/>
				<StyledInput
					label="Last Name"
					bind:val={lastNameInput}
					className="w-64"
					borderError={!isLNValid}
					placeholder="Last name" 
					required
				/>
			</div>
			<StyledInput
				label="Email"
				type="email"
				bind:val={emailInput}
				className="mt-5"
				borderError={!isEmailValid && emailInput !== ""}
				placeholder="example@string.xyz" 
				required
			/>
			{#if !isEmailValid && emailInput !== ""}
				<p class="text-error mt-2">Invalid email address</p>
			{/if}

			<div class="flex justify-start mt-9">
				<input
					type="checkbox"
					bind:checked={tosAgreement}
					class="checkbox checkbox-primary"
					class:border-error={!isTOSValid}
				/>
				<span class="ml-2 text-sm"
					>I accept the
					<a
						href="https://www.string.xyz/terms-of-service"
						target="_blank"
						rel="noopener noreferrer"
						class="link link-primary">Terms of Service</a
					>
					and the
					<a
						href="https://www.string.xyz/privacy-policy"
						target="_blank"
						rel="noopener noreferrer"
						class="link link-primary">Privacy Policy</a
					>
				</span>
			</div>
			<div class="mt-7 mb-8 float-right">
				<BackButton {back} />
				<StyledButton type="submit" wide={false}>Send Link</StyledButton>
			</div>
		</div>
	</form>
</ModalBase>
