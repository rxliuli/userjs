import metablock from 'rollup-plugin-userscript-metablock'
import sucrase from '@rollup/plugin-sucrase'
import rollupExternalModules from 'rollup-external-modules'

export default {
  input: 'src/index.ts',
  output: {
    file: 'dist/index.user.js',
    format: 'iife',
    globals: {
      'rx-util': 'rx',
    },
  },
  external: rollupExternalModules,
  plugins: [
    sucrase({
      exclude: ['node_modules/**'],
      transforms: ['typescript'],
    }),
    metablock(),
  ],
}
