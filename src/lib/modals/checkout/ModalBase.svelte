<script lang="ts">
	import { modalManager } from '$lib/stores';
	import { Events, sendEvent } from '$lib/events';

	export let title: string;

	const close = () => {
		modalManager.set(null);
		sendEvent(Events.IFRAME_CLOSE)
	}
</script>

<div class="str-modal text-neutral border border-neutral">
	<header class="flex justify-between">
		<span class="text-2xl font-bold title">{title}</span>
		<button on:click={close}><img src="/assets/close.svg" alt="Close" /></button>
	</header>
	<div class="content">
		<slot />
	</div>
	<footer class="footer footer-center my-6 select-none text-xs">
		<div class="inline">
			<span class="">Powered by <img class="inline" src="/assets/string_text_logo.svg" alt="String" /></span>
		</div>
	</footer>
</div>

<style>
	.str-modal {
		padding-left: 36px;
		padding-right: 36px;
		padding-top: 36px;
		border-radius: 8px;
		max-width: 374px;
		overflow: hidden;
		background: white;
		user-select: none;
	}
</style>
