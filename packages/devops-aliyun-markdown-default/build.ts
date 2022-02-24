import { build, Plugin } from 'esbuild'
import * as path from 'path'
import * as process from 'process'
import { readJson } from 'fs-extra'

function generateBanner(meta: typeof GM_info.script) {
  return (
    [
      '// ==UserScript==',
      ...Object.entries(meta)
        .map(([key, value]) => {
          if (Array.isArray(value)) {
            return value.map((item) => `// @${key} ${item}`)
          }
          return `// @${key} ${value}`
        })
        .flat(),
      '// ==/UserScript==',
    ].join('\n') + '\n'
  )
}

function userJS(): Plugin {
  return {
    name: 'esbuild-plugin-userjs',
    async setup(build) {
      const json = (await readJson(path.resolve('package.json'))) as {
        userjs: typeof GM_info.script
      }
      if (!json.userjs) {
        throw new Error('userjs is not supported')
      }
      if (!build.initialOptions.banner) {
        build.initialOptions.banner = {}
      }
      build.initialOptions.banner!['js'] = generateBanner(json.userjs)
    },
  }
}

async function main() {
  const watch = process.argv[2] === '-w'
  await build({
    entryPoints: [path.resolve(__dirname, 'src/index.ts')],
    outfile: path.resolve('dist/index.user.js'),
    bundle: true,
    plugins: [userJS()],
    absWorkingDir: __dirname,
    watch,
    incremental: watch,
  })
}

main()
