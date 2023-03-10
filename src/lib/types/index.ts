import { z } from "zod";

export interface Quote {
	timestamp: number;
	baseUSD: string;
	gasUSD: string;
	tokenUSD: string;
	serviceUSD: string;
	totalUSD: string;
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
	txId: string;
	txUrl: string;
}

export interface Card {
	token: string;
	scheme: string;
	last4: number;
}

export const zNFT = z.object({
	name: z.string(),
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
