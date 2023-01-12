<script lang='ts'>
	import { item } from "$lib/stores";
</script>

<img class="token-logo" src={`/assets/tokens/${$item.currency}.svg`} alt={$item.currency + " Logo"} />
<span>{$item.price}</span>
<span>{$item.currency || 'AVAX'}</span>

<style>
	.token-logo {
		display: inline;
		max-width: 16px;
		max-height: 16px;
		margin-right: 4px;
	}
</style>