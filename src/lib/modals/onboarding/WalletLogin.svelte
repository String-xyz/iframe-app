<script>
	import ModalBase from "./ModalBase.svelte";
	import ShowWallet from "$lib/components/onboarding/ShowWallet.svelte";
</script>

<ModalBase title="Pay with String">
	<h1>String makes it easy to purchase digital assets with your credit or debit card. Log-in with your wallet to complete your purchase. This is where we are going to send blockchain items when purchased.</h1>
	<ShowWallet />
	<div class="text-center">
		<button on:click={close} class="btn btn-wide btn-primary rounded border-2 normal-case block m-auto">Pay with String</button>
	</div>
</ModalBase>