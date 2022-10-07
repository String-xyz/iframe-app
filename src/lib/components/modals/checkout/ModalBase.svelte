<script lang="ts">
	import { modalManager } from '$lib/stores';

	export let title: string;

	const close = () => {
		modalManager.set(null);
	};
</script>

<!-- <div class="backdrop" on:click|stopPropagation> -->
	<div class="modal">
		<header class="flex justify-between">
			<span class="text-2xl font-bold title">{title}</span>
			<button on:click={close}><img src="/assets/close.svg" alt="Close" /></button>
		</header>
		<div class="content">
			<slot />
		</div>
		<footer class="footer footer-center my-6 select-none text-xs">
			<div class="inline">
				<span>Powered by <img class="inline" src="/assets/string_logo_text_gray.svg" alt="String" /></span>
			</div>
		</footer>
	</div>
<!-- </div> -->

<style>
	:global(.divider:before),
	:global(.divider:after) {
		height: 1px !important;
	}
/* 
	.backdrop {
		width: 100%;
		height: 100%;
		position: fixed;
		background: rgba(0, 0, 0, 0.8);
	} */

	.modal {
		padding-left: 36px;
		padding-right: 36px;
		padding-top: 36px;
		border-radius: 10px;
		max-width: 374px;
		overflow: hidden;
		background: white;
		user-select: none;
	}
</style>
