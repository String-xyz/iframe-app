<script lang="ts">
	import { contractPayload } from '$lib/stores';
	import { abbrev } from '$lib/utils';

	$: address = $contractPayload.userAddress || "";
</script>

<div id="addr">
	<h2 class="text-md flex justify-between mt-5">
		<span>Send to</span>
		<span>{abbrev(address)}</span>
	</h2>
</div>