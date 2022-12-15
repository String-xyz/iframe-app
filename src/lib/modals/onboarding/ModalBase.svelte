<script lang="ts">
	import { modalManager } from '$lib/stores';
	import { Events, sendEvent } from '$lib/events';

	export let title: string;

	const close = () => {
		modalManager.set(null);
		sendEvent(Events.IFRAME_CLOSE)
	}
</script>

<div class="str-modal text-neutral">
	<header class="flex justify-between">
		<span class="text-3xl font-bold title text-neutral">{title}</span>
		<button on:click={close}><img src="/assets/close.svg" alt="Close" /></button>
	</header>
	<div class="content">
		<slot />
	</div>
</div>

<style>
	:global(.divider:before),
	:global(.divider:after) {
		height: 1px !important;
	}
	
	.str-modal {
		padding-left: 36px;
		padding-right: 36px;
		padding-top: 36px;
		border-radius: 8px;
		border: 1px solid black;
		overflow: hidden;
		background: white;
		user-select: none;
		width: 600px;
		height: 540px;
	}
</style>
