<script lang="ts">
	import { onMount } from 'svelte';
	import { modalManager } from '$lib/stores';

	import { Events, registerEvents, sendEvent } from '$lib/events';

	onMount(async () => {
		await registerEvents();
		
		sendEvent(Events.IFRAME_READY)
	});

	let modal: any;

	$: modal?.scrollHeight && sendResize()

	const sendResize = () => {
		console.log("resize", modal.scrollHeight)
		sendEvent(Events.IFRAME_RESIZE, {"height": modal.scrollHeight})
	}
	
</script>

<svelte:component bind:this={modal} this={$modalManager} />
