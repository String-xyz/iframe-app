export interface Quote {
	timestamp: number;
	baseUSD: number;
	gasUSD: number;
	tokenUSD: number;
	serviceUSD: number;
	totalUSD: number;
	signature: string;
}

export interface TransactPayload extends Quote {
	userAddress: string;
	chainID: number;
	contractAddress: string;
	contractFunction: string;
	contractReturn: string;
	contractParameters: string[];
	txValue: string;
	gasLimit: string;
	cardToken: string;
}

export interface TransactionResponse {
	txID: string;
	txUrl: string;
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

export interface StringPayload {
	apiKey: string;
	name: string;
	collection: string;
	currency: string;
	price: number;
	imageSrc: string;
	imageAlt?: string;
	chainID: number;
	userAddress: string;
	contractAddress: string;
	contractFunction: string;
	contractReturn: string,
	contractParameters: string[];
	txValue: string;
	user: {
		walletAddress: string; /** @duplicated can we get rid of userAddress? */
		id?: string;
		email?: string;
		status?: string;
	};
}
