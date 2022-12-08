<script>
	import { abbrev } from "$lib/utils";
	import { contractPayload } from '$lib/stores';

	$: address = $contractPayload.userAddress || "";

</script>

<span class="dot"></span>
<span class="ml-2">{abbrev(address)}</span>

<style>
	.dot {
		height: 12px;
		width: 12px;
		background-color: #15E883;
		border-radius: 50%;
		display: inline-block;
	}
</style>