import { ethers } from 'ethers';

export function createWalletService(): WalletService {
	let _provider: ethers.providers.Web3Provider | undefined;

	function getProvider() {
		if (!_provider) {
			_provider = new ethers.providers.Web3Provider(window.ethereum);
		}

		return _provider;
	}

	async function isConnected() {
		try {
			const accounts = await getProvider().listAccounts();
			return accounts?.length > 0;
		} catch (e) {
			console.error('-- isConnected error --', e);
			return false;
		}
	}

	/** @return {string} wallet address */
	async function connectWallet() {
		try {
			// connect wallet
			const accounts: string[] = await window.ethereum.request({ method: 'eth_requestAccounts' });
			if (!accounts[0]) throw new Error('no wallet');

			// once wallet is connected listen to account changes
			window.ethereum.on('accountsChanged', function (accounts: any) {
				console.log('------------> accounts changed:', accounts);
				// TODO update storage
			});

			return accounts[0];
		} catch (e) {
			console.error('-- connectWallet error --', e);
			throw e;
		}
	}

	async function getActiveWallet() {
		return window.ethereum.request({ method: 'eth_requestAccounts' });
	}

	return {
		isConnected,
		connectWallet,
		getActiveWallet
	};
}

export interface WalletService {
	isConnected: () => Promise<boolean>;
	connectWallet: () => Promise<string>;
	getActiveWallet: () => Promise<string>;
}