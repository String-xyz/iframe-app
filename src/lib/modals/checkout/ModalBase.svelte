<script lang="ts">
	import { modalManager } from '$lib/stores';
	import { Events, sendEvent } from '$lib/events';

	export let title: string;

	const close = () => {
		modalManager.set(null);
		sendEvent(Events.IFRAME_CLOSE);
	};
</script>

<div class="str-modal text-neutral border border-neutral">
	<header class="flex flex-col justify-between">
		<button class="ml-auto pr-6" on:click={close}><img src="/assets/close.svg" alt="Close" /></button>
		<span class="text-2xl font-bold title pr-9 mt-1">{title}</span>
	</header>
	<div class="content pr-9">
		<slot />
	</div>
	<footer class="flex flex-col justify-center items-center my-6 pr-9 text-xs">
		<span class="">Powered by <img class="inline" src="/assets/string_text_logo.svg" alt="String" /></span>
	</footer>
</div>

<style>
	.str-modal {
		padding-left: 36px;
		padding-top: 24px;
		border-radius: 8px;
		max-width: 374px;
		overflow-y: hidden;
		background: white;
	}
</style>
