import metablock from 'rollup-plugin-userscript-metablock'
import typescript from 'rollup-plugin-typescript2'
import commonjs from 'rollup-plugin-commonjs'
import nodeResolve from 'rollup-plugin-node-resolve'

export default {
  input: 'src/index.ts',
  output: {
    file: 'dist/index.user.js',
    format: 'iife',
  },
  plugins: [
    commonjs({
      // non-CommonJS modules will be ignored, but you can also
      // specifically include/exclude files
      include: ['./index.js', 'node_modules/**'], // Default: undefined

      // if true then uses of `global` won't be dealt with by this plugin
      ignoreGlobal: false, // Default: false

      // if false then skip sourceMap generation for CommonJS modules
      sourceMap: false, // Default: true
    }),

    nodeResolve(),
    typescript(),
    metablock(),
  ],
}
