<script lang="ts">
	import { onMount } from 'svelte';
	import { modalManager, modalProps, isAuthorized } from '$lib/stores';
	import OrderDetails from '$lib/modals/checkout/OrderDetails.svelte';
	import { Events, registerEvents, sendEvent } from '$lib/events';

	onMount(() => {
		registerEvents();
		modalManager.set(OrderDetails);
		sendEvent(Events.IFRAME_READY)
	});

	let modal: any;

	$: modal?.scrollHeight && sendResize()

	const sendResize = () => {
		sendEvent(Events.IFRAME_RESIZE, {"height": modal.scrollHeight})
	}
	
</script>

{#if $isAuthorized}
	<svelte:component bind:this={modal} this={$modalManager} {...$modalProps} />
{/if}
