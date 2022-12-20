<script lang="ts">
	import ModalBase from './ModalBase.svelte';
	import BackButton from '$lib/components/shared/BackButton.svelte';
	import StyledButton from '$lib/components/shared/StyledButton.svelte';

	import ResendEmailLink from './ResendEmailLink.svelte';
	import Onboarding from './Onboarding.svelte';

	import { email, modalManager } from '$lib/stores';
	import { z } from "zod";

	let tosAgreement = false;
	let firstNameInput = "";
	let lastNameInput = ""
	let emailInput = "";

	let isFNValid = true;
	let isLNValid = true;
	let isEmailValid = true;
	let isTOSValid = true;


	const emailSchema = z.string().trim().email();
	const nameSchema = z.string().min(1);
	
	const handleVerify = () => {
		if (!isValidInput()) return;
		email.set(emailInput)
		next()

	}
	
	const isValidInput = () => {
		isEmailValid = emailSchema.safeParse(emailInput).success;

		isFNValid = nameSchema.safeParse(firstNameInput).success;

		isLNValid = nameSchema.safeParse(lastNameInput).success;

		isTOSValid = tosAgreement;

		return isEmailValid && isFNValid && isLNValid && isTOSValid;
	}

	//TODO: We want the error to be removed when the field is empty
	// const checkEmailEmpty = () => {
	// 	if (emailInput.length == 0) {
	// 		isEmailValid = true;
	// 	}
	// }

	const back = () => {
		modalManager.set(Onboarding);
	};

	const next = () => {
		modalManager.set(ResendEmailLink);
	};
</script>

<ModalBase title="Verify your email" size="size-form">
	<form on:submit|preventDefault={handleVerify}>
		<p class="text-xl mt-5">To proceed, we'll need a bit of information and to verify your email.</p>
		<div class="mt-5">
			<div class="flex justify-between">
				<div class="mt-4">
					<label for="name">First name</label>
					<div class="name mt-1">
						<input
							bind:value={firstNameInput}
							class="input input-bordered border-2 w-64"
							class:border-error="{!isFNValid}"
							placeholder="First name"
							autofocus
							required
						/>
					</div>
				</div>
				<div class="mt-4">
					<label for="name">Last name</label>
					<div class="name mt-1">
						<input
							bind:value={lastNameInput}
							class="input input-bordered border-2 w-64"
							class:border-error="{!isLNValid}"
							placeholder="Last name"
							required
						/>
					</div>
				</div>
			</div>
			<div class="mt-5">
				<label for="email">Email address</label>
				<div class="email mt-1">
					<input
						bind:value={emailInput}
						class="input input-bordered border-2 w-full"
						class:border-error="{!isEmailValid}"
						placeholder="test@string.xyz"
						required
					/>

					{#if !isEmailValid}
						<p class="text-error mt-2">Invalid email address</p>
					{/if}
				</div>
			</div>
			<div class="flex justify-start mt-9">
				<input type="checkbox" bind:checked={tosAgreement} class="checkbox checkbox-primary" class:border-error='{!isTOSValid}' />
				<span class="ml-2 text-sm">I accept the 
					<a href="https://www.string.xyz/terms-of-service" target='_blank' rel="noopener noreferrer" class="link link-primary">Terms of Service</a> 
					and the 
					<a href="https://www.string.xyz/privacy-policy" target='_blank' rel="noopener noreferrer" class="link link-primary">Privacy Policy</a>
				</span>
			</div>
			<div class="mt-7 float-right">
				<BackButton {back} />
				<StyledButton type="submit" wide={false}>Send Link</StyledButton>
			</div>
		</div>
	</form>
</ModalBase>