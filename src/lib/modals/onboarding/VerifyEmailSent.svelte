<script>
	import ModalBase from "./ModalBase.svelte";
	import { email } from "$lib/stores";

	const resendLink = () => {
		
	}

	const back = () => {

	}
</script>

<ModalBase title="Verify your Email">
	<h1 class="">We sent an email to {email}.</h1>
	<h1 class="mt-5">Follow the instructions to verify your credentials.</h1>
	<p class="mt-5">Haven’t received the email? Check your spam folder</p>
	<div class="text-center mt-7">
		<span on:click={back} class="inline-block mt-6 cursor-pointer">
			<img class="inline mr-2" src="/assets/back_arrow.svg" alt="back">
			Back
		</span>
		<button on:click={resendLink} class="btn btn-wide btn-primary rounded border-2 normal-case block m-auto">Resend Link</button>
	</div>
</ModalBase>