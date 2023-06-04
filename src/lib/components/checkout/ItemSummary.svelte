<script lang="ts">
	import Address from "./Address.svelte";
	import type { NFT } from "$lib/types";

	export let item: NFT;

	// const getTip = (text: string | undefined) => {
	// 	if (!text) return "";
	// 	return text.length > 24 ? text : "";
	// }
</script>

<div class="flex justify-between bg-gray-blue-10 bg-opacity-40 rounded-2xl font-semibold w-full p-4">
	<div class="flex justify-items-start w-3/4">
		<img
			src={item.imageSrc}
			alt={item.imageAlt ?? "Item image"}
			class="rounded-lg mr-4"
			width="72px"
			height="72px"
		/>
		<div class="select-text whitespace-nowrap w-3/4">
			<p class="text-primary my-1 truncate">{item.collection ?? ""}</p>
			<p class="text-xl truncate">{item.assetName}</p>
		</div>
	</div>
	<div class="flex flex-col">
		<span class="flex items-center text-gray-blue-100 ml-auto mb-2">
			{item.price}
			<img
				src={`/assets/tokens/${item.currency}.svg`}
				alt={item.currency + " Logo"}
				class="inline ml-2"
				width="16px"
				height="16px"
			/>
		</span>
		<Address />
	</div>
</div>