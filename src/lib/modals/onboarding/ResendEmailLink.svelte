<script>
	import ModalBase from './ModalBase.svelte';
	import BackButton from '$lib/components/shared/BackButton.svelte';
	// import StyledButton from '$lib/components/shared/StyledButton.svelte';

	import VerifyEmailForm from './VerifyEmailForm.svelte';
	import { email, modalManager } from '$lib/stores';

	const back = () => {
		email.set('');
		modalManager.set(VerifyEmailForm);
	};
</script>

<ModalBase title="Verify your Email" size="size-resend">
	<div class="text-xl mt-5">
		<span>We sent an email to <span class="font-bold">{$email}</span></span>
		<p class="mt-2">Follow the instructions to verify your credentials.</p>
	</div>
	<p class="mt-5">Haven’t received the email? Check your spam folder</p>
	<div class="float-right mt-7">
		<BackButton {back} />
		<!-- <StyledButton action={resend} wide={false}>Resend Link</StyledButton> -->
	</div>
</ModalBase>
