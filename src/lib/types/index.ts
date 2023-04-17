import { z } from "zod";

export interface TransactionRequest {
    userAddress: string;
	assetName: string;
    chainID: number;
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
    transactionRequest: TransactionRequest;
    estimate: Estimate;
    signature: string;
}

export interface PaymentInfo {
    cardToken?: string;
    cardId?: string;
    cvv?: string;
}

export interface ExecutionRequest {
    quote: Quote;
    paymentInfo: PaymentInfo;
}

export interface TransactionResponse {
	txId: string;
	txUrl: string;
}

export interface Card {
	token: string;
	scheme: string;
	last4: number;
}

export const zNFT = z.object({
	assetName: z.string(),
	price: z.number(),
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
