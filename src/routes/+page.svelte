<script lang="ts">
	import { onMount } from 'svelte';
	import { startIframe } from '../index';
	import { modalManager } from '$lib/stores';
	import { Events, sendEvent } from '$lib/events';

	onMount(async () => {
		await startIframe();
	});

	let modal: any;

	$: modal?.scrollHeight && sendResize();

	const sendResize = () => {
		console.log('resize', modal.scrollHeight);
		sendEvent(Events.IFRAME_RESIZE, { height: modal.scrollHeight });
	};
</script>

<svelte:component this={$modalManager} bind:this={modal} />
