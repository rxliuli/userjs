import metablock from 'rollup-plugin-userscript-metablock'
import typescript from 'rollup-plugin-typescript2'

export default {
  input: 'src/index.ts',
  output: {
    file: 'dist/index.user.js',
    format: 'esm',
  },
  plugins: [typescript(), metablock()],
}
