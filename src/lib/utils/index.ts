import type { Card } from "$lib/types";

export const abbrevAddr = (addr = "") => {
	return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
}

export const numericFilter = (e: KeyboardEvent, input = "", capLength = -1) => {
	if (e.key < '0' || e.key > '9' || (capLength > -1 && input.length >= capLength)) {
		e.preventDefault();
	}
}

export const capInputLength = (e: KeyboardEvent, input = "", capLength = -1) => {
	if (capLength > -1 && input.length >= capLength) {
		e.preventDefault();
	}
}

export const capitalize = (text: string) => {
	if (!text) return text;
	return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
}

export const formatExpiryDate = (card: Card) => {
	const shortYear = card.expiryYear.toString().slice(-2);
	const formattedMonth = card.expiryMonth.toString().padStart(2, '0');

	return `${formattedMonth}/${shortYear}`;
}