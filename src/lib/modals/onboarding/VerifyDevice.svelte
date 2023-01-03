<script>
	import ModalBase from './ModalBase.svelte';
	import BackButton from '$lib/components/shared/BackButton.svelte';
	import StyledButton from '$lib/components/shared/StyledButton.svelte';

	import Onboarding from './Onboarding.svelte';
	import OrderDetails from '../checkout/OrderDetails.svelte';
	import VerifyEmailForm from './VerifyEmailForm.svelte';

	import { email, modalManager } from '$lib/stores';
	import { AuthState, retryLogin } from '$lib/services';

	const sendToCheckout = () => {
		modalManager.set(OrderDetails);
	};

	const sendToVerify = () => {
		modalManager.set(VerifyEmailForm)
	}

	const retry = async () => {
		const { state } = await retryLogin();

		switch (state) {
			case AuthState.AUTHORIZED:
				sendToCheckout();
			break;

			case AuthState.DEVICE_UNVERIFIED:
				alert("Could not verify device, please check your email again");
			break;

			case AuthState.EMAIL_UNVERIFIED:
				sendToVerify();
			break;
		}
	}

	const back = () => {
		modalManager.set(Onboarding);
	};
</script>

<ModalBase title="Verify this Device" size="size-resend">
	<div class="text-xl mt-5">
		<span>We need to verify this device to keep your account secure.</span> 
		<span>We've sent an email to <span class="font-bold">{$email}</span>.</span>
		<p>Open the link in the email and click the button below to continue.</p>
	</div>
	<p class="mt-5">Haven’t received the email? Check your spam folder</p>
	<div class="float-right mt-7">
		<BackButton {back} />
		<StyledButton action={retry} wide={false}>Retry Login</StyledButton>
	</div>
</ModalBase>
