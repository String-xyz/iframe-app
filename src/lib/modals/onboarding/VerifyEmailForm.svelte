<script lang="ts">
	import ModalBase from './ModalBase.svelte';
	import { email, modalManager } from '$lib/stores';

	import { Events, sendEvent } from '$lib/events';
	import VerifyEmailSent from './VerifyEmailSent.svelte';

	let tosAgreement = false;
	let firstNameInput = "";
	let lastNameInput = ""
	let emailInput = "";

	const sendVerify = () => {
		email.set(emailInput)
	}

	const back = () => {
		modalManager.set(null);
		sendEvent(Events.IFRAME_CLOSE)
	};

	const next = () => {
		modalManager.set(VerifyEmailSent);
	};
</script>

<ModalBase title="Verify your email">
	<form on:submit|preventDefault={sendVerify}>
		<div class="text-center mt-6">
			<div class="flex justify-center">
				<div class="mt-4">
					<label for="name">First name</label>
					<div class="name mt-1">
						<input
							bind:value={firstNameInput}
							class="input input-bordered border-2"
							placeholder="First name"
							required
						/>
					</div>
				</div>
				<div class="mt-4">
					<label for="name">Last name</label>
					<div class="name mt-1">
						<input
							bind:value={lastNameInput}
							class="input input-bordered border-2 "
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
						placeholder="test@string.xyz"
						required
					/>
				</div>
			</div>
			<div class="form-control">
				<label class="label cursor-pointer">
					<input type="checkbox" bind:checked={tosAgreement} class="checkbox checkbox-primary" />
					<span class="label-text">I accept the 
						<a href={"#"} class="link link-primary">Terms of Service</a> 
						and the 
						<a href={"#"} class="link link-primary">Privacy Policy</a>
					</span>
				</label>
			</div>
			<span on:click={back} class="inline-block mt-6 cursor-pointer">
				<img class="inline mr-2" src="/assets/back_arrow.svg" alt="back">
				Back
			</span>
			<button on:click={next} class="btn btn-wide btn-primary rounded border-2 tracking-wider	text-white">
				Send Link
			</button>
		</div>
	</form>
</ModalBase>
