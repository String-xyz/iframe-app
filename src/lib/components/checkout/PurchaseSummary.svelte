<script lang="ts">
	import { quote, stopQuote, contractPayload,
		refreshQuote, finalQuote } from '$lib/stores';
	import type { NFT } from '$lib/types';

	import { abbrev, getBlockExplorer } from '$lib/utils';
	import { onMount, onDestroy } from 'svelte';
	import { fade } from 'svelte/transition';

	export let item: NFT;
	export let final = false;
	export let txID = "";

	onMount(async () => {
		console.log("purchasesummary", item)
		if (item) {
			await refreshQuote();
		}
	});

	onDestroy(() => {
		stopQuote();
	});

	$: quoted = $quote?.data?.quote.estimate;
</script>

{#if final}
	<span class="text-xl font-bold mt-9">Purchase summary</span>
	<div class="flex justify-between mt-4">
		<span>Transaction</span>
		<span>
			<a href={getBlockExplorer($contractPayload.chainID) + txID} target='_blank' rel='noreferrer'>
				<span class="text-primary mr-3">{abbrev(txID)}</span>
				<img class="inline" src="/assets/external_link.svg" alt="Ext Link" />
			</a>
		</span>
	</div>
	<div class="flex justify-between mt-2">
		<span>Date</span><span>{new Date().toLocaleString('en-US')}</span>
	</div>
	<div class="flex justify-between mt-2 mb-6">
		<span>Total</span><span>$ {$finalQuote?.data?.quote.estimate.totalUSD.toFixed(2)}</span>
	</div>

{:else}
	<div class="flex justify-between mt-9">
		<span class="text-xl font-bold">Purchase summary</span>
	</div>
	{#if quoted}
		{#key quoted}
			<div class="text-sm mt-5">
				<div class="flex justify-between">
					<span>Item price</span><span in:fade="{{ duration: 1000 }}">$ {quoted.baseUSD.toFixed(2)}</span>
				</div>
				<div class="flex justify-between mt-2">			
					<span>Network fee</span><span in:fade="{{ duration: 1000 }}">$ {quoted.gasUSD.toFixed(2)}</span>
				</div>
				<div class="flex justify-between mt-2">
					<span>Service fee</span><span in:fade="{{ duration: 1000 }}">$ {quoted.serviceUSD.toFixed(2)}</span>
				</div>
			</div>
			<div class="divider" />
			<div class="flex justify-between mb-4 text-xl">
				<span class="font-bold">Total</span><span in:fade="{{duration: 1000 }}">$ {quoted.totalUSD.toFixed(2)}</span>
			</div>
		{/key}
		<div class="flex justify-between mt-3">
			<span class="text-xs">
				Quote updates every 10s
			</span>
			<!-- <Countdown /> -->
		</div>
	{:else}
		<div class="my-5 text-center">
			<!-- {#if $currentAccount} -->
				<h1>Waiting for Quote</h1>
			<!-- {:else}
				<h1>Please connect your wallet</h1>
			{/if} -->
		</div>
	{/if}
{/if}
