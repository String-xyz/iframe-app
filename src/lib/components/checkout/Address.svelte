<script lang="ts">
	import { __user } from '$lib/stores';
	import { abbrev } from '$lib/utils';

	$: address = $__user.walletAddress || 'No Wallet Connected';
</script>

<div class="addr">
	<h2 class="text-md flex justify-between mt-5">
		<span>Send to</span>
		<span>{abbrev(address)}</span>
	</h2>
</div>
