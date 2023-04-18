<script lang='ts'>
	export let action = () => {};
	export let disabled = false;
	export let type: "button" | "submit" = "button";
	export let wide = true;
</script>

<button on:click={action} {disabled} {type} class:btn-wide={wide} class:w-40={!wide} class="btn btn-primary rounded border-2 tracking-wider text-white h-11 mb-6">
	<slot />
</button>

<style>
	.btn[disabled] {
		background-color: #B6D5EC;
		color: #FAF9F9;
	}
</style>