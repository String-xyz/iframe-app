<script lang="ts">
	import { onMount } from 'svelte';
	import { startIframe } from '../index';
	import { modalManager } from '$lib/stores';

	onMount(async () => {
		await startIframe();
	});

	let modal: any;

</script>

<svelte:component this={$modalManager} bind:this={modal} />
