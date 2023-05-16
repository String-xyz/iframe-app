<script>
	import ModalBase from '../ModalBase.svelte';
	import BackButton from '$lib/components/shared/BackButton.svelte';

	import VerifyEmailForm from './VerifyEmailForm.svelte';

	import { __user, modalManager } from '$lib/stores';

	const back = () => {
		$__user.email = '';
		modalManager.set(VerifyEmailForm);
	}

</script>

<ModalBase title="Verify your email" type="onboarding">
	<div class="text-xl mt-5">
		<span>We sent an email to <span class="font-bold">{$__user.email}</span></span>
		<p class="mt-2">Follow the instructions to verify your credentials.</p>
	</div>
	<p class="mt-5">Haven’t received the email? Check your spam folder</p>
	<div class="float-right mt-7 mb-11">
		<BackButton {back} />
	</div>
</ModalBase>
