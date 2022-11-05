<script lang="ts">
	import { item } from '$lib/stores';
	import Price from './Price.svelte';

</script>

<div class="flex justify-start mt-4">
	<img class="item" src={$item.imageSrc} alt={$item.imageAlt} />
	<div class="ml-4">
		<div class="text-bold text-black">{$item.name}</div>
		<div class="text-bold text-black text-sm mb-2">{$item.collection}</div>

		<Price />
	</div>
</div>

<style>
	.item {
		max-width: 100px;
		max-height: 100px;
	}
</style>
