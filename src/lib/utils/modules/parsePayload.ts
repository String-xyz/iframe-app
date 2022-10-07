import { z } from "zod";
import { error } from '@sveltejs/kit';
import type { NFT, ContractPayload, StringPayload } from '$lib/types';

const PayloadSchema = z.object({
	name: z.string(),
	collection: z.string(),
	imageSrc: z.string(),
	imageAlt: z.string().optional(),
	currency: z.string(),
	price: z.number(),
	chainID: z.number(),
	userAddress: z.string(),
	contractAddress:z.string(),
	contractABI: z.string().array(),
	contractFunction: z.string(),
	contractParameters: z.string().array(),
	txValue: z.string()
});

// export type Payload = z.infer<typeof PayloadSchema>;

// Validate payload before it reaches the API so nothing breaks
export const parsePayload = (payload: StringPayload) => {
	try {
		payload = PayloadSchema.parse(payload);

		const item: NFT = {
			name: payload.name,
			price: payload.price,
			currency: payload.currency,
			collection: payload.collection,
			imageSrc: payload.imageSrc,
			imageAlt: payload?.imageAlt ?? "NFT"
		}

		const contractParams: ContractPayload = {
			chainID: payload.chainID,
			userAddress: payload.userAddress,
			contractAddress: payload.contractAddress,
			contractABI: payload.contractABI,
			contractFunction: payload.contractFunction,
			contractParameters: payload.contractParameters,
			txValue: payload.txValue,
			gasLimit: payload.gasLimit
		}

		console.log(item)
		
		return {item, contractParams}
	} catch (e: any) {
		throw error(400, "Invalid String-API Payload: " + e);
	}
}
