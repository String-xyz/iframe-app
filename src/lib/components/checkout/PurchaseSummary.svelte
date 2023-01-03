<script lang="ts">
	import { item, txID, txURL, finalQuote, contractPayload, quote } from '$lib/stores';
	import { quoteService } from '$lib/services';
	import { abbrev } from '$lib/utils';

	import { onMount, onDestroy } from 'svelte';
	import { fade } from 'svelte/transition';

	export let final = false;

	onMount(async () => {
		if ($item) {
			await quoteService.startQuote($contractPayload, quote);
		}
	});

	onDestroy(() => {
		quoteService.stopQuote(quote);
	});
</script>

{#if final}
	<span class="text-xl font-bold mt-9">Purchase summary</span>
	<p class="text-sm mt-2">We’ve sent a receipt to your email</p>
	<div class="flex justify-between mt-5">
		<span>Transaction</span>
		<span>
			<a href={$txURL} target="_blank" rel="noreferrer">
				<span class="text-primary mr-3">{abbrev($txID)}</span>
				<img class="inline" src="/assets/external_link.svg" alt="Ext Link" />
			</a>
		</span>
	</div>
	<div class="flex justify-between mt-2">
		<span>Date</span><span>{new Date().toLocaleString('en-US')}</span>
	</div>
	<div class="flex justify-between mt-2 mb-6">
		<span>Total</span><span>$ {$finalQuote?.totalUSD.toFixed(2)}</span>
	</div>
{:else}
	<div class="flex justify-between mt-9">
		<span class="text-xl font-bold">Purchase summary</span>
	</div>
	{#if $quote?.totalUSD}
		{#key $quote}
			<div class="text-sm mt-5">
				<div class="flex justify-between">
					<span>Item price</span><span in:fade={{ duration: 1000 }}
						>$ {$quote?.baseUSD?.toFixed(2)}</span
					>
				</div>
				<div class="flex justify-between mt-2">
					<span>Network fee</span><span in:fade={{ duration: 1000 }}
						>$ {$quote?.gasUSD?.toFixed(2)}</span
					>
				</div>
				<div class="flex justify-between mt-2">
					<span>Service fee</span><span in:fade={{ duration: 1000 }}
						>$ {$quote?.serviceUSD?.toFixed(2)}</span
					>
				</div>
			</div>
			<div class="divider" />
			<div class="flex justify-between mb-4 text-xl">
				<span class="font-bold">Total</span><span in:fade={{ duration: 1000 }}
					>$ {$quote?.totalUSD?.toFixed(2)}</span
				>
			</div>
		{/key}
		<div class="flex justify-between mt-3">
			<span class="text-xs">
				<img class="inline" src="/assets/info.svg" alt="info" />
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
