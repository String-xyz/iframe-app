<script lang="ts">
	import { onMount } from 'svelte';
	import { modalManager, modalProps, isAuthorized } from '$lib/stores';
	import OrderDetails from '$lib/components/modals/checkout/OrderDetails.svelte';
	import { registerEvents } from '$lib/events';

	onMount(() => {
		registerEvents();
		modalManager.set(OrderDetails);
	});
</script>

{#if $isAuthorized}
	<svelte:component this={$modalManager} {...$modalProps} />
{/if}
