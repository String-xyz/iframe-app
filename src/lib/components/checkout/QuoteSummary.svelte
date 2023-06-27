<script lang="ts">
	import { fade } from 'svelte/transition';
	import { quote } from '$lib/stores';

</script>

<div class="border border-gray-blue-20 rounded-2xl w-full p-4">
	{#key $quote}
		<div class="text-gray-blue-60 text-lg font-medium select-text">
			<div class="flex justify-between mb-4">
				<span>Item price</span>
				<span in:fade={{ duration: 1000 }}>
					${$quote?.estimate.baseUSD ?? "..."}
				</span>
			</div>
			<div class="flex justify-between mb-4">
				<span>Network fee</span>
				<span in:fade={{ duration: 1000 }}>
					${$quote?.estimate.gasUSD ?? "..."}
				</span>
			</div>
			<div class="flex justify-between">
				<span>Processing fee</span>
				<span in:fade={{ duration: 1000 }}>
					${$quote?.estimate.serviceUSD ?? "..."}
				</span>
			</div>
		</div>
		<div class="divider mt-3" />
		<div class="text-gray-blue-100 text-lg font-medium">
			{#if $quote}
				<div class="flex justify-between select-text">
					<span>Total</span>
					<span in:fade={{ duration: 1000 }}>
						${$quote?.estimate.totalUSD ?? "..."}
					</span>
				</div>
			{:else}
				<div class="flex justify-center">
					<span>Waiting for quote</span>
				</div>
			{/if}
			
			<div class="flex justify-between text-gray-blue-80 mt-2">
				<span class="flex items-center text-sm">
					<img src="/assets/info.svg" alt="info" class="inline mr-1" />
					Quote updates every 10s
				</span>
				<!-- <span class="text-gray-blue-60">Price update in </span>
				<span class="text-primary"></span> -->
			</div>
		</div>
	{/key}
</div>