<script lang="ts">
	import { z } from 'zod';
	import { sdkService } from '$lib/services';
	import { __user, modalManager } from '$lib/stores';

	import ModalBase from "../ModalBase.svelte";
	import StyledInput from "$lib/components/shared/StyledInput.svelte";
	import StyledButton from '$lib/components/shared/StyledButton.svelte';

	import CheckEmail from './CheckEmail.svelte';
	import Purchase from '../checkout/Purchase.svelte';

	let firstNameInput = "";
	let lastNameInput = "";
	let emailInput = "";
	let tosAgreement = false;

	let isFNValid = true;
	let isLNValid = true;
	let isEmailValid = true;
	let isTOSValid = true;

	const emailSchema = z.string().trim().email();
	const nameSchema = z.string().min(1).max(100);

	const isValidInput = () => {
		isEmailValid = emailSchema.safeParse(emailInput).success;
		isFNValid = nameSchema.safeParse(firstNameInput).success;
		isLNValid = nameSchema.safeParse(lastNameInput).success;
		isTOSValid = tosAgreement;

		return isEmailValid && isFNValid && isLNValid && isTOSValid;
	}

	async function requestEmailVerification() {
		/**
		 * Due to the actual implementation of the email verification, the endpoint waits for the user to click on the link in the email
		 * This is not ideal and will be change in the future. For now, we immediately redirect the user to the next modal and wait for a response
		 * If the response is a success, we allow the user to continue with the checkout process
		 * if the response is an error, we go back to the previous modal
		 */

		next(); // first go next until we solve the endpoint waiting time

		try {
			if (!$__user.id) throw new Error('User ID is not defined');

			const { status } = await sdkService.requestEmailVerification($__user.id, emailInput);
			
			if (status === 'email_verified') {
				modalManager.set(Purchase);
			}
		} catch (e: any) {
			if (e.code === 'CONFLICT') return alert('This email is already verified');

			alert('An unexpected error has occurred. Please try again.');
		}
	}	

	const handleOnboarding = async () => {
		if (!isValidInput()) return;
		if (!$__user.id) return;

		try {
			const userUpdate = {
				walletAddress: $__user.walletAddress,
				firstName: firstNameInput,
				lastName: lastNameInput
			}

			await sdkService.updateUserName($__user.id, userUpdate);

			next();
			await requestEmailVerification();
		} catch (e) {
			console.log(e);
		}
	}

	const next = () => {
		$__user.email = emailInput;

		modalManager.set(CheckEmail);
	}

</script>
<ModalBase>
	<div class="main flex flex-col justify-center items-center">
		<img src="/assets/headers/email_icon.svg" alt="email" class="mb-4" />
		<h1 class="text-3xl font-semibold mb-4">Get Started with String</h1>
		<p class="text-gray-blue-60 text-center text-lg font-medium mb-8">
			String is the most convenient way to purchase NFTs and crypto from within your favorite game. Sign up below!
		</p>
		<form class="w-full" on:submit|preventDefault={handleOnboarding}>
			<div class="flex mb-4">
				<StyledInput
					label="First name"
					bind:val={firstNameInput}
					className="w-1/2 mr-4"
					borderError={!isFNValid}
					placeholder="First name" 
					autofocus
					required
				/>
				<StyledInput
					label="Last name"
					bind:val={lastNameInput}
					className="w-1/2"
					borderError={!isLNValid}
					placeholder="Last name" 
					required
				/>
			</div>

			<StyledInput
				label="Email address"
				type="email"
				bind:val={emailInput}
				className="w-full"
				borderError={!isEmailValid && emailInput !== ""}
				placeholder="Email" 
				required
			/>
			{#if !isEmailValid && emailInput !== ""}
				<p class="text-sm text-error font-medium mt-2">Please enter a valid email address.</p>
			{/if}

			<div class="flex justify-start items-center mt-4 mb-10">
				<input
					type="checkbox"
					bind:checked={tosAgreement}
					class="checkbox checkbox-primary"
					class:border-error={!isTOSValid}
				/>
				<span class="ml-2 text-sm"
					>I accept the
					<a
						href="https://www.string.xyz/legal/terms-of-service"
						target="_blank"
						rel="noopener noreferrer"
						class="link link-primary">Terms of Service</a
					>
					and the
					<a
						href="https://www.string.xyz/legal/privacy-policy"
						target="_blank"
						rel="noopener noreferrer"
						class="link link-primary">Privacy Policy</a
					>
				</span>
			</div>

			<StyledButton type="submit">Continue</StyledButton>
		</form>
	</div>
</ModalBase>