const networks = [
	{
		chainId: 43113,
		explorer: "https://testnet.snowtrace.io/tx/",
	},
	{
		chainId: 5,
		explorer: "https://goerli.etherscan.io/tx/",
	},
	{
		chainId: 80001,
		explorer: "https://mumbai.polygonscan.com/tx/",
	}
]


export const getBlockExplorer = (chainId: number) => {
	return networks.find(data => data.chainId == chainId)?.explorer ?? networks[0].explorer;
};

