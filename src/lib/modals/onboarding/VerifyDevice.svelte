<script>
	import ModalBase from './ModalBase.svelte';
	import BackButton from '$lib/components/shared/BackButton.svelte';
	import StyledButton from '$lib/components/shared/StyledButton.svelte';

	import VerifyEmailForm from './VerifyEmailForm.svelte';
	import OrderDetails from '../checkout/OrderDetails.svelte';

	import { email, modalManager } from '$lib/stores';

	$email = "test@string.xyz"
	const ENV = import.meta.env.VITE_ENV;


	const next = () => {
		modalManager.set(OrderDetails);
	};

	const back = () => {
		email.set('');
		modalManager.set(VerifyEmailForm);
	};
</script>

<ModalBase title="Verify this Device" size="size-resend">
	<div class="text-xl mt-5">
		<span>We need to verify this device to keep your account secure.</span> 
		<span>We've sent an email to <span class="font-bold">{$email}</span>.</span>
		<p >Open the link in the email to continue.</p>
	</div>
	<p class="mt-5">Haven’t received the email? Check your spam folder</p>
	<div class="float-right mt-7">
		<BackButton {back} />
		<!-- <StyledButton action={resend} wide={false}>Resend Email</StyledButton> -->
	</div>
</ModalBase>
