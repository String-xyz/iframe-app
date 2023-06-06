module.exports = {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	theme: {
		extend: {
			colors: {
				'gray-blue': {
					'10':  '#ECEEF1',
					'20':  '#D8DDE2',
					'40':  '#8A98A9',
					'60':  '#3C5370',
					'80':  '#243243',
					'100': '#0C1116',
				}
			},
		},
	},
	daisyui: {
		themes: [
			{
				stringTheme: {
					primary: '#2176F0',

					secondary: '#F92572',

					neutral: '#002F5B',

					success: '#15E883',

					warning: '#FFEB84',

					error: '#F92572'
				}
			}
		]
	},
	plugins: [require('daisyui')]
};
