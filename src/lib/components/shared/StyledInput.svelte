<script lang="ts">
	import { onMount } from 'svelte';

	export let label = '';
	export let id = '';
	export let className = '';
	export let borderError = false;
	export let autofocus = false;
	export let val = '';

	let focused = false;
	let inputElm: HTMLInputElement;

	onMount(() => {
		if (autofocus) {
			inputElm.focus();
		}
	});

</script>

<div class={"flex flex-col " + className}>
	<label for={id} class="text-gray-blue-60 font-medium ml-1 my-2 whitespace-nowrap">{label}</label>
	<input
		{id}
		class="text-gray-blue-100 border border-gray-blue-20 rounded-lg px-4 h-14"
		class:!border-error={borderError && !focused}
		on:focus={() => focused = true}
		on:blur={() => focused = false}
		bind:this={inputElm}
		bind:value={val}
		{...$$restProps}
	/>
</div>

<style lang="postcss">
	::placeholder {
		@apply text-gray-blue-40;
	}
</style>