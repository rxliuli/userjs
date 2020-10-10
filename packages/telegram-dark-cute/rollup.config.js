import metablock from 'rollup-plugin-userscript-metablock'
import typescript from 'rollup-plugin-typescript2'
import { nodeResolve } from '@rollup/plugin-node-resolve'

export default {
  input: 'src/index.ts',
  output: {
    file: 'dist/index.user.js',
    format: 'iife',
  },
  plugins: [nodeResolve(), typescript(), metablock()],
}
