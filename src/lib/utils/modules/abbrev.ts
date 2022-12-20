export const abbrev = (addr = "") => {
	return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
};
