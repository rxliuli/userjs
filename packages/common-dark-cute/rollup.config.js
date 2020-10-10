import typescript from 'rollup-plugin-typescript2'
import rollupExternalModules from 'rollup-external-modules'

export default {
  input: 'src/index.ts',
  output: {
    file: 'dist/index.js',
    format: 'esm',
  },
  external: rollupExternalModules,
  plugins: [typescript()],
}
