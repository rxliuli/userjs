import metablock from 'rollup-plugin-userscript-metablock'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import sucrase from '@rollup/plugin-sucrase'

export default {
  input: 'src/index.ts',
  output: {
    file: 'dist/index.user.js',
    format: 'iife',
  },
  plugins: [
    nodeResolve(),
    sucrase({
      exclude: ['node_modules/**'],
      transforms: ['typescript'],
    }),
    metablock(),
  ],
}
