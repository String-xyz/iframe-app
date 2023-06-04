<script lang="ts">
	import { __user } from '$lib/stores';
	import { abbrev } from '$lib/utils';

	// $: address = $__user.walletAddress || 'No Wallet Connected';

	let address = "0x45D8aFcBAbaFC00d84CD6971cE005935c0f69Fe5";
</script>

<div class="rounded-lg bg-primary py-1 px-2">
	<span class="text-gray-blue-10 text-sm font-semibold">{abbrev(address)}</span>
</div>
