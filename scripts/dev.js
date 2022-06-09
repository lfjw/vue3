const { build } = require('esbuild')
const { resolve } = require('path')
// minimist 解析命令行
const args = require('minimist')(process.argv.slice(2));
// 目标
const target = args._[0] || 'reactivity';
// 打包的格式
const format = args.f || 'global';

const pkg = require(resolve(__dirname, `../packages/${target}/package.json`));

// 输出的格式
// iife 立即执行函数 script  (function(){})()
// cjs  node模块    module.exports
// esm  es6模块 浏览器  export
const outputFormat = format.startsWith('global')
  ? 'iife'
  : format === 'cjs'
    ? 'cjs'
    : 'esm'

const outfile = resolve( // 输出的文件
  __dirname,
  `../packages/${target}/dist/${target}.${format}.js`
)

build({
  entryPoints: [resolve(__dirname, `../packages/${target}/src/index.ts`)],
  outfile,
  bundle: true, // 所有的包打包到一起
  sourcemap: true,
  format: outputFormat,
  globalName: pkg.buildOptions?.name, // 打包的全局名字
  platform: format === 'cjs' ? 'node' : 'browser',
  watch: { // 监控文件变化
    onRebuild(error) {
      if (!error) console.log(`rebuilt~~~~`)
    }
  }
}).then(() => {
  console.log('watching~~~')
})