import metablock from 'rollup-plugin-userscript-metablock'
import typescript from 'rollup-plugin-typescript2'
import rollupExternalModules from 'rollup-external-modules'

export default {
  input: 'src/index.ts',
  output: {
    file: 'dist/index.user.js',
    format: 'iife',
  },
  external: rollupExternalModules,
  plugins: [typescript(), metablock()],
}
