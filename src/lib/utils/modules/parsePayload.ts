import { z } from "zod";
import type { NFT, StringPayload } from '$lib/types';
import type { UserStore } from "$lib/stores";

const PayloadSchema = z.object({
	apiKey: z.string(),
	name: z.string(),
	collection: z.string(),
	imageSrc: z.string(),
	imageAlt: z.string().optional(),
	currency: z.string(),
	price: z.number(),
	chainID: z.number(),
	userAddress: z.string(),
	contractAddress: z.string(),
	contractFunction: z.string(),
	contractReturn: z.string(),
	contractParameters: z.string().array(),
	txValue: z.string(),
	user: z.object({
		walletAddress: z.string(),
		id: z.string().optional(),
		email: z.string().optional(),
		status: z.string().optional()
	}),
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
		};

		const user: UserStore = {
			walletAddress: payload.user.walletAddress,
			id: payload?.user?.id ?? "",
			email: payload?.user?.email ?? "",
			status: payload.user.status ?? ""
		};

		return { item, user }
	} catch (e: any) {
		alert("Oops! Something went wrong. Please try again.");
	}
}
