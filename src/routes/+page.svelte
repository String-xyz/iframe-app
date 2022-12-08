<script lang="ts">
	import { onMount } from 'svelte';
	import { modalManager, isAuthorized } from '$lib/stores';
	import OrderDetails from '$lib/modals/checkout/OrderDetails.svelte';

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

{#if $isAuthorized}
	<svelte:component bind:this={modal} this={$modalManager} />
{/if}
