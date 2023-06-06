<svg class="spinner" viewBox="0 0 50 50">
	<circle class="path" cx="25" cy="25" r="20" fill="none" stroke-width="4"></circle>
</svg>

<style>
	.spinner {
		width: 24px;
		height: 24px;
		animation: rotate 2s linear infinite;
		transform-origin: center;
	}

	.spinner .path {
		stroke: #FFFFFF;
		stroke-linecap: round; 
		animation: dash 1.5s ease-in-out infinite;
	}

	@keyframes rotate {
		0% {
			transform: rotate(0deg);
		}
		100% {
			transform: rotate(360deg);
		}
	}

	@keyframes dash {
		0% {
			stroke-dasharray: 1, 150;
			stroke-dashoffset: 0;
		}
		50% {
			stroke-dasharray: 90, 150;
			stroke-dashoffset: -35;
		}
		100% {
			stroke-dasharray: 90, 150;
			stroke-dashoffset: -125;
		}
	}
</style>