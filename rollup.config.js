import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import { terser } from 'rollup-plugin-terser';
import css from 'rollup-plugin-css-only';
import multi from '@rollup/plugin-multi-entry';
const production = !process.env.ROLLUP_WATCH;

export default {
	input:'src/js/main.js',
	output: {
		sourcemap: true,
		format: 'iife',
		name: 'version',
		file: 'src/public/build/bundle.min.js',
		plugins:[terser()]
	},
	plugins: [
		// we'll extract any component CSS out into
		// a separate file - better for performance
		css({ output: 'bundle.css' }),

		// If you have external dependencies installed from
		// npm, you'll most likely need these plugins. In
		// some cases you'll need additional configuration -
		// consult the documentation for details:
		// https://github.com/rollup/plugins/tree/master/packages/commonjs
		resolve({
			browser: true,
		}),
		commonjs(),
		// If we're building for production (npm run build
		// instead of npm run dev), minify
		production && terser()
	]
}
