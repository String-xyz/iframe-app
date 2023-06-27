<script lang="ts">
	import { __user } from '$lib/stores';
	import { abbrevAddr } from '$lib/utils';

	$: address = $__user.walletAddress || 'No Wallet Connected';

</script>

<div class="flex items-center rounded-lg bg-primary p-2">
	<div class="bg-white rounded-[4px] p-1 mr-2">
		<img src="/assets/to_wallet.svg" alt="wallet" class="mr-2" />
	</div>
	<span class="text-gray-blue-10 text-sm font-semibold">
		{abbrevAddr(address)}
	</span>
</div>
