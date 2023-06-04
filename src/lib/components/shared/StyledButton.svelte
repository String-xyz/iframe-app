<script lang='ts'>
	export let action = () => {};
	export let className = '';
	export let disabled = false;
	export let type: "button" | "submit" = "button";
	export let wide = true;
</script>

<button
	on:click={action}
	class:btn-wide={wide}
	class:w-40={!wide}
	class={"btn btn-secondary font-semibold normal-case text-lg text-white h-14 w-full " + className}
	{disabled}
	{type}
>
	<slot />
</button>

<style lang='postcss'>
	.btn {
		border-radius: 40px;
	}

	.btn:disabled {
		@apply bg-gray-blue-10;
		@apply text-gray-blue-40;
	}
</style>