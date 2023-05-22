<script lang="ts">
	import ModalBase from '../ModalBase.svelte';
	import BackButton from '$lib/components/shared/BackButton.svelte';
	import StyledButton from '$lib/components/shared/StyledButton.svelte';

	import Onboarding from './Onboarding.svelte';
	import OrderDetails from '../checkout/OrderDetails.svelte';
	import VerifyEmailForm from './VerifyEmailForm.svelte';

	import { modalManager, userEmailPreview } from '$lib/stores';
	import { sdkService } from '$lib/services';

	const sendToCheckout = () => {
		modalManager.set(OrderDetails);
	};

	const sendToVerify = () => {
		modalManager.set(VerifyEmailForm);
	};

	const retry = async () => {
		try {
			const { user } = await sdkService.retryLogin();

			if (user.status !== 'email_verified') {
				return sendToVerify();
			} else {
				return sendToCheckout();
			}
		} catch (err: any) {
			console.log('Could not verify device: ' + err.code);
			handleAuthError(err);
		}
	};

	const handleAuthError = (err: any) => {
		if (err.code === 'UNPROCESSABLE_ENTITY')
			return alert('Could not verify device, please check your email again');

		alert('An unexpected error has occurred. Please try again.');
	}

	const back = () => {
		modalManager.set(Onboarding);
	}

</script>

<ModalBase title="Verify this device" type="onboarding">
	<div class="text-xl mt-5">
		<p>We detected that you are using a new device.</p>
		<p class="mb-5">We’ve sent an email to {$userEmailPreview ?? "the email on file"}</p>
		<p>Follow the instructions in the email and click the button below to continue.</p>
	</div>
	<p class="mt-5">Haven’t received the email? Check your spam folder</p>
	<div class="float-right mt-7">
		<BackButton {back} />
		<StyledButton action={retry} wide={false}>Retry Login</StyledButton>
	</div>
</ModalBase>
