<script lang="ts">
	import { card, finalQuote, modalManager } from '$lib/stores';

	import ModalBase from '../ModalBase.svelte';
	import StyledButton from '$lib/components/shared/StyledButton.svelte';

	import ItemSummary from '$lib/components/checkout/ItemSummary.svelte';
	import QuoteSummary from '$lib/components/checkout/QuoteSummary.svelte';
	import PaymentSelect from '$lib/components/checkout/PaymentSelect.svelte';
	import type { NFT, Quote } from '$lib/types';

	// import BackButton from '$lib/components/shared/BackButton.svelte';
	// import Address from '$lib/components/checkout/Address.svelte';
	// import PurchaseSummary from '$lib/components/checkout/PurchaseSummary.svelte';
	// import CardSelect from '$lib/components/checkout/CardSelect.svelte';


	// $: disabled = $card?.token == undefined || $quote?.estimate.totalUSD == undefined;

	let disabled = true;
	// const purchase = () => {
	// 	finalQuote.set($quote);
	// 	modalManager.set(Processing);
	// };

	let quote: Quote = {
		"request": {
			"userAddress": "0x45D8aFcBAbaFC00d84CD6971cE005935c0f69Fe5",
			"assetName": "String DEV NFT Fuji",
			"chainId": 43113,
			"contractAddress": "0xeA1fFe2cF6630a20E1BA397e95358DAF362c8781",
			"contractFunction": "mintTo(address)",
			"contractReturn": "uint256",
			"contractParameters": [
				"0x45D8aFcBAbaFC00d84CD6971cE005935c0f69Fe5"
			],
			"txValue": "0.08 eth",
			"gasLimit": "800000"
		},
		"estimate": {
			"timestamp": 1685568298,
			"baseUSD": "1.18",
			"gasUSD": "0.04",
			"tokenUSD": "0.00",
			"serviceUSD": "0.34",
			"totalUSD": "1.56"
		},
		"signature": "0x88018899ec661716324b5cf611118679b44b9512af0dba51da8cf7d19f732ee33f9859af5ca7a1c3deee225d9eb12c022b8d89d10bb2fb17a6e537ea644d2cc900"
	}

	let item: NFT = {
		assetName: "String Test NFT [AVAX]",
		collection: "String Demo",
		imageSrc: "https://bafybeieqi56p6vlxofj6wkoort2m5r72ajhtikpzo53wnyze5isvn34fze.ipfs.nftstorage.link/Demo_Character_1.png",
		imageAlt: "String NFT",
		price: "0.08",
		currency: "AVAX",
	}


	const handlePurchase = () => {

	}

	const close = () => {
		modalManager.set(null);
	}

	// const back = () => {
	// 	modalManager.set(OrderDetails);
	// };
</script>

<ModalBase>
	<div class="main flex flex-col justify-center items-center">
		<header class="grid grid-cols-4 items-center w-full mb-3">
			<img src="/assets/headers/back_arrow.svg" alt="back" class="inline" />
			<h1 class="text-2xl whitespace-nowrap font-semibold">Complete your Purchase</h1>
		</header>

		<ItemSummary {item} />

		<div class="my-3 w-full">
			<QuoteSummary {quote} />
		</div>

		<div class="mb-12 mr-auto">
			<h2 class="text-gray-blue-100 text-xl font-semibold mb-2">Payment Method:</h2>
			<PaymentSelect />
		</div>

		<StyledButton
			action={handlePurchase}
			{disabled}
		>
			Buy Now
		</StyledButton>
	</div>
</ModalBase>
