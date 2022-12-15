module.exports = {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	daisyui: {
		themes: [
			{
				stringTheme: {
					primary: '#006AB7',

					secondary: '#F92572',

					neutral: '#003669',

					success: '#15E883',

					warning: '#FFEB84',

					error: '#F92572'
				}
			}
		]
	},
	plugins: [require('daisyui')]
};
