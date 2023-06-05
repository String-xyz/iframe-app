<div class="spinner" />

<style>
	.spinner {
		border: 4px solid rgba(255, 255, 255, 0.4);
		border-radius: 50%;
		border-top: 4px solid #FFFFFF;
		width: 24px;
		height: 24px;
		-webkit-animation: spin 2s linear infinite; /* Safari */
		animation: spin 2s linear infinite;
	}

	@-webkit-keyframes spin {
		0% {
			-webkit-transform: rotate(0deg);
		}
		100% {
			-webkit-transform: rotate(360deg);
		}
	}

	@keyframes spin {
		0% {
			transform: rotate(0deg);
		}
		100% {
			transform: rotate(360deg);
		}
	}
</style>
