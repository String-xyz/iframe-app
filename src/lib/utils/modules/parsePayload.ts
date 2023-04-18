import { type IframePayload, zNFT, zUser } from '$lib/types';

// Validate payload before it reaches the API so nothing breaks
export const parsePayload = (payload: IframePayload) => {
	try {
		const nft = zNFT.parse(payload.nft);
		const user = zUser.parse(payload.user);

		return { item: nft, user }
	} catch (e: any) {
		console.debug("Error parsing payload", e);
		alert("An unexpected error has occurred. Please try again.");
	}
}
