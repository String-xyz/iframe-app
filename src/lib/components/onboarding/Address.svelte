<script>
	import { abbrev } from '$lib/utils';
	import { contractPayload } from '$lib/stores';

	$: address = $contractPayload.userAddress
		? abbrev($contractPayload.userAddress)
		: 'No Wallet Connected';
</script>

<p>
	<span class="dot" />
	<span class="ml-2">{address}</span>
</p>

<!-- TODO: Dinamically change the  dot color. If wallet is not connected show a red dot  -->
<style>
	.dot {
		height: 12px;
		width: 12px;
		background-color: #15e883;
		border-radius: 50%;
		display: inline-block;
	}
</style>
