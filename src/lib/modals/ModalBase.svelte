<div class="str-modal text-neutral border border-neutral" role="dialog" aria-modal="true">
	<div class="content">
		<slot />
	</div>
	<footer class="flex flex-col justify-center items-center mt-6">
		<span class="text-gray-blue-40 font-medium">Powered by <img class="inline ml-1" src="/assets/string_text_logo.svg" alt="String" width=70 height=15 /></span>
	</footer>
</div>

<style>
	.str-modal {
		padding: 32px;
		border-radius: 16px;
		overflow-y: hidden;
		background: white;
		width: 600px;
	}

</style>
