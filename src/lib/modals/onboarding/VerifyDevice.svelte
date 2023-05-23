<script lang="ts">
	import ModalBase from '../ModalBase.svelte';
	import BackButton from '$lib/components/shared/BackButton.svelte';

	import Onboarding from './Onboarding.svelte';

	import { modalManager, userEmailPreview, __user } from '$lib/stores';

	const back = () => {
		modalManager.set(Onboarding);
	}

</script>

<ModalBase title="Verify this device" type="onboarding">
	<div class="text-xl mt-5">
		<p>We detected that you are using a new device.</p>
		<p class="mb-5">We’ve sent an email to {$userEmailPreview ?? "the email on file"}</p>
		<p>Follow the instructions in the email and wait for the screen to continue.</p>
	</div>
	<p class="mt-5">Haven’t received the email? Check your spam folder.</p>
	<div class="float-right mt-7 mb-6">
		<BackButton {back} />
		<!-- <StyledButton action={resendVerify} wide={false}>Resend Email</StyledButton> -->
	</div>
</ModalBase>
