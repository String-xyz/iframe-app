<script lang="ts">
	import { modalManager } from '$lib/stores';
	import { Events, sendEvent } from '$lib/events';

	type ModalType = "checkout" | "onboarding";

	export let title: string;

	export let type: ModalType;

	const close = () => {
		modalManager.set(null);
		sendEvent(Events.IFRAME_CLOSE);
	}

</script>

<div class={"str-modal text-neutral border border-neutral " + type} role="dialog" aria-modal="true">
	<header class="flex flex-col justify-between">
		<button class="ml-auto mr-6" on:click={close}><img src="/assets/close.svg" alt="Close" /></button>
		<span class="text-2xl font-bold title pr-9 mt-1">{title}</span>
	</header>
	<div class="content pr-9">
		<slot />
	</div>
	{#if type === "checkout"}
		<footer class="flex flex-col justify-center items-center my-6 pr-9 text-xs">
			<span>Powered by <img class="inline" src="/assets/string_text_logo.svg" alt="String" /></span>
		</footer>
	{/if}
</div>

<style>
	.str-modal {
		padding-left: 36px;
		padding-top: 24px;
		border-radius: 8px;
		overflow-y: hidden;
		background: white;
	}

	.checkout {
		max-width: 374px;
	}

	.onboarding {
		width: 600px;
	}

</style>
