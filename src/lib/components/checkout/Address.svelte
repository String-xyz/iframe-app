<script lang="ts">
	import { __user } from '$lib/stores';
	import { abbrevAddr } from '$lib/utils';

	$: address = $__user.walletAddress || 'No Wallet Connected';

</script>

<div class="rounded-lg bg-primary py-1 px-2">
	<span class="text-gray-blue-10 text-sm font-semibold">{abbrevAddr(address)}</span>
</div>
