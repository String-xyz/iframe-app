<script lang="ts">
	import { modalManager } from '$lib/stores';
	import { sendEvent, Events } from '$lib/events';
	import { abbrev } from '$lib/utils';
	import type { NFT } from '$lib/types';

	import ModalBase from '../ModalBase.svelte';
	import ItemSummary from '$lib/components/checkout/ItemSummary.svelte';


	const close = () => {
		modalManager.set(null);
		sendEvent(Events.IFRAME_CLOSE);
	}

	let item: NFT = {
		assetName: "String Test NFT [AVAX]",
		collection: "String Demo",
		imageSrc: "https://bafybeieqi56p6vlxofj6wkoort2m5r72ajhtikpzo53wnyze5isvn34fze.ipfs.nftstorage.link/Demo_Character_1.png",
		imageAlt: "String NFT",
		price: "0.08",
		currency: "AVAX",
	}

	let dateOptions: Intl.DateTimeFormatOptions = {
		year: 'numeric',
		month: 'numeric',
		day: 'numeric',
		hour: 'numeric',
		minute: '2-digit'
	}
	let txURL = "https://testnet.snowtrace.io/tx/0x88153a0d4906448c303282775470b4e5ea50457d40c23015e33120e228aa470c";
	let txID = "0x88153a0d4906448c303282775470b4e5ea50457d40c23015e33120e228aa470c";
	let txTimestamp = new Date().toLocaleString('en-US', dateOptions);
	let txTotal = "69";

	const handleKeyboard = (e: KeyboardEvent) => {
		if (e.key == "Escape") {
			close();
		}
	}
	
</script>

<svelte:window on:keydown={(e) => handleKeyboard(e)} />

<ModalBase>
	<header class="flex justify-end w-full mb-8">
		<button on:click={close}>
			<img src="/assets/headers/close.svg" alt="close" />
		</button>
	</header>
	<div class="main flex flex-col justify-center items-center">
		<img src="/assets/headers/success.svg" alt="success" class="mb-5" />
		<h1 class="text-3xl font-semibold mb-4">Thank you for your purchase!</h1>
		<p class="text-gray-blue-60 text-lg font-medium mb-12">We sent a receipt to your email.</p>
		<ItemSummary {item} />

		<div class="mt-12 mb-6 w-full">
			<h2 class="text-gray-blue-100 text-lg font-semibold mr-auto">Purchase Summary</h2>
			<div class="divider my-3" />
			<div class="text-gray-blue-60 text-lg font-medium select-text">
				<div class="flex justify-between mb-4">
					<span>Transaction</span>
					<a href={txURL} target="_blank" rel="noreferrer" class="flex items-center">
						<span class="text-primary mr-2">{abbrev(txID)}</span>
						<img class="inline" src="/assets/ext_link.svg" alt="Tx link" />
					</a>
				</div>
				<div class="flex justify-between mb-4">
					<span>Date</span>
					<span>{txTimestamp}</span>
				</div>
				<div class="divider my-3" />
				<div class="flex justify-between">
					<span>Total</span>
					<span>${txTotal}</span>
				</div>
			</div>
		</div>
	</div>
</ModalBase>
