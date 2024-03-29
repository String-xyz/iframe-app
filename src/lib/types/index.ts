import { z } from "zod";

export interface ExecutionRequest {
	userAddress: string;
	assetName: string;
	chainId: number;
	contractAddress: string;
	contractFunction: string;
	contractReturn: string;
	contractParameters: string[];
	txValue: string;
	gasLimit: string;
}

export interface Estimate {
	timestamp: number;
	baseUSD: string;
	gasUSD: string;
	tokenUSD: string;
	serviceUSD: string;
	totalUSD: string;
}

export interface Quote {
	request: TransactionRequest;
	estimate: Estimate;
	signature: string;
}

export interface PaymentInfo {
	cardToken?: string;
	cardId?: string;
	cvv?: string;
	saveCard?: boolean;
}

export interface TransactionRequest {
	quote: Quote;
	paymentInfo: PaymentInfo;
}

export interface TransactionResponse {
	txId: string;
	txUrl: string;
	txTimestamp: string;
}

export interface SavedCardResponse {
	type: string;
	id: string;
	scheme: string;
	last4: string;
	expiryMonth: number;
	expiryYear: number;
	expired: boolean;
	cardType: string;
}

export interface Card {
	token?: string;
	cardId?: string;
	scheme: string;
	last4: string;
	expiryMonth: number;
	expiryYear: number;
	expired?: boolean;
	isSavedCard: boolean;
	shouldSaveCard?: boolean;
}

export const zNFT = z.object({
	assetName: z.string(),
	price: z.string(),
	currency: z.string(),
	collection: z.string().optional(),
	imageSrc: z.string(),
	imageAlt: z.string().optional()
});

export const zUser = z.object({
	walletAddress: z.string(),
	id: z.string().optional(),
	status: z.string().optional(),
	email: z.string().optional(),
});

export type NFT = z.infer<typeof zNFT>;
export type User = z.infer<typeof zUser>;

export interface IframePayload {
	nft: NFT;
	user: User
}
