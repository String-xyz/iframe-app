<script lang="ts">
	import { modalManager } from '$lib/stores';
	import { Events, sendEvent } from '$lib/events';

	export let title: string;

	const close = () => {
		modalManager.set(null);
		sendEvent(Events.IFRAME_CLOSE);
	}
</script>

<div class="str-modal text-neutral border border-neutral">
	<header class="flex justify-between">
		<span class="text-3xl font-bold title text-neutral">{title}</span>
		<button on:click={close}><img src="/assets/close.svg" alt="Close" /></button>
	</header>
	<div class="content">
		<slot />
	</div>
</div>

<style>
	.str-modal {
		padding-left: 36px;
		padding-right: 36px;
		padding-top: 36px;
		border-radius: 8px;
		width: 600px;
		overflow-y: hidden;
		background: white;
	}
</style>
