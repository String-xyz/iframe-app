import * as FingerprintJS from '@fingerprintjs/fingerprintjs-pro';

const CUSTOM_SUBDOMAIN = import.meta.env.VITE_ANALYTICS_SUBDOMAIN_URL || "https://metrics.string.xyz";
const apiKey = import.meta.env.VITE_ANALYTICS_LIB_PK || ""; // TODO: Make this param required

export function createAnalyticsService(options = {}) {
	let fpInstance: FingerprintJS.Agent | undefined;


	async function getFPInstance() {
		const loadOptions = {
			apiKey,
			endpoint: [
				CUSTOM_SUBDOMAIN, // This endpoint will be used primarily
				FingerprintJS.defaultEndpoint // The default endpoint will be used if the primary fails
			],
			...options
		};

		if (!fpInstance) {
			fpInstance = await FingerprintJS.load(loadOptions);
		}

		return fpInstance;
	}

	async function getVisitorData(options = { extendedResult: true }) {
		try {
			const fp = await getFPInstance();
			const visitorData = await fp.get(options);
			return visitorData;
		} catch (e) {
			console.error('analytics service error:', e);
		}
	}

	return { getFPInstance, getVisitorData }
};
