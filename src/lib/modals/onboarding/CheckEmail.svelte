<script>
	import { __user, modalManager } from '$lib/stores';

	import StyledButton from '$lib/components/shared/StyledButton.svelte';

	import ModalBase from '../ModalBase.svelte';
	import GetStarted from './GetStarted.svelte';

	let canResend = false;

	const resendVerify = () => {
	
	}

	const back = () => {
		$__user.email = '';
		modalManager.set(GetStarted);
	}

</script>

<ModalBase>
	<div class="main flex flex-col justify-center items-center">
		<img src="/assets/headers/email_icon.svg" alt="email" class="mb-4" />
		<h1 class="text-3xl font-semibold mb-4">Check Your Email!</h1>
		<div class="text-lg font-medium text-center text-gray-blue-60 mb-6">
			<span>We sent an email to <span class="font-bold">{$__user.email}</span></span>
			<p>Please follow the instructions to verify your email</p>
		</div>
		<StyledButton className="mb-4" action={resendVerify} disabled={!canResend}>Resend Email</StyledButton>
		<button on:click={back} class="flex items-center text-gray-blue-100 font-medium mb-6">
			<img class="inline mr-2" src="/assets/back_arrow.svg" alt="back">
			Back
		</button>
		<p class="text-gray-blue-60 font-medium">Don't see the email? Check your spam folder</p>
	</div>
</ModalBase>
