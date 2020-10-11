import metablock from 'rollup-plugin-userscript-metablock'
import sucrase from '@rollup/plugin-sucrase'

export default {
  input: 'src/index.ts',
  output: {
    file: 'dist/index.user.js',
    format: 'iife',
  },
  plugins: [
    sucrase({
      exclude: ['node_modules/**'],
      transforms: ['typescript'],
    }),
    metablock(),
  ],
}
