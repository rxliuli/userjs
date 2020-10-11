import sucrase from '@rollup/plugin-sucrase'

export default {
  input: 'src/index.ts',
  output: {
    file: 'dist/index.js',
    format: 'esm',
  },
  plugins: [
    sucrase({
      exclude: ['node_modules/**'],
      transforms: ['typescript'],
    }),
  ],
}
