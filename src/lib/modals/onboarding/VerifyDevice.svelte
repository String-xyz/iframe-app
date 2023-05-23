<script lang="ts">
	import ModalBase from '../ModalBase.svelte';
	import BackButton from '$lib/components/shared/BackButton.svelte';

	import Onboarding from './Onboarding.svelte';
	import OrderDetails from '../checkout/OrderDetails.svelte';

	import { onMount } from 'svelte';
	import { sdkService } from '$lib/services';
	import { modalManager, userEmailPreview, __user } from '$lib/stores';

	onMount(async () => {
		await requestDeviceVerification();
	});

	const sendToCheckout = () => {
		modalManager.set(OrderDetails);
	};

	const requestDeviceVerification = async () => {
		const { status } = await sdkService.requestDeviceVerification($__user.walletAddress);
			
		if (status === 'verified') {
			sendToCheckout();
		}
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
		<!-- <StyledButton action={resendVerify} wide={false}>Resend Email</StyledButton> -->
	</div>
</ModalBase>
