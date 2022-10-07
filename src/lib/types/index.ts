export interface Quote {
	estimate: {
		timestamp: number;
		baseUSD: number;
		gasUSD: number;
		tokenUSD: number;
		serviceUSD: number;
		totalUSD: number;
	};
	signature: string;
}

export interface TransactPayload {
	success: boolean;
	data: {
		chainID: number;
		userAddress: string;
		contractAddress: string;
		contractABI: string[];
		contractFunction: string;
		contractParameters: string[];
		txValue: string;
		gasLimit: string;
		type: number;
		quote: Quote;
		cardToken: string;
	};
}

export interface Card {
	token: string;
	scheme: string;
	last4: number;
}

export interface NFT {
	name: string;
	price: number;
	currency: string;
	collection: string;
	imageSrc: string;
	imageAlt?: string;
}

export interface ContractPayload {
	chainID: number;
	userAddress: string;
	contractAddress: string;
	contractABI: string[];
	contractFunction: string;
	contractParameters: string[];
	txValue: string;
	gasLimit: string;
}

export interface StringPayload {
	name: string;
	collection: string;
	currency: string;
	price: number;
	imageSrc: string;
	imageAlt?: string;
	chainID: number;
	userAddress: string;
	contractAddress: string;
	contractABI: string[],
	contractFunction: string;
	contractParameters: string[];
	txValue: string;
}