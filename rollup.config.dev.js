import path from 'path'
import alias from "@rollup/plugin-alias";
import {nodeResolve} from '@rollup/plugin-node-resolve';
import ts from 'rollup-plugin-typescript2'
import serve from 'rollup-plugin-serve'
import commonjs from 'rollup-plugin-commonjs' // commonjs模块转换插件
// import {terser} from 'rollup-plugin-terser';
import {eslint} from 'rollup-plugin-eslint' // eslint插件
import postcss from 'rollup-plugin-postcss'
import autoprefixer from 'autoprefixer'
import cssnano from 'cssnano'

import babel from 'rollup-plugin-babel'
import livereload from 'rollup-plugin-livereload'
import nodePolyfills from 'rollup-plugin-node-polyfills';
import inject from '@rollup/plugin-inject'
import globals from 'rollup-plugin-node-globals';
import builtins from 'rollup-plugin-node-builtins';
import replace from "rollup-plugin-replace";

// `npm run build` -> `production` is true
// `npm run dev` -> `production` is false
const production = !process.env.ROLLUP_WATCH;

const projectRootDir = path.resolve(__dirname);
import packageJSON from './package.json'

const customResolver = nodeResolve({
  extensions: ['.mjs', '.js', '.jsx', '.json', '.sass', '.scss']
});

// 需要导出的模块类型
const outputMap = [
  {
    file: packageJSON.main, // 通用模块
    format: 'esnext',
  },
  {
    file: packageJSON.module, // es6模块
    format: 'es',
  }
]
const silence = new Map()

export default {
  input: path.resolve(__dirname, 'src/main.ts'),//入口文件
  output:[
    {
      file: path.resolve(__dirname, 'dist/bundle.js'),//打包后的存放文件
      // global: 弄个全局变量来接收
      // cjs: module.exports
      // esm: export default
      // iife: ()()
      // umd: 兼容 amd + commonjs 不支持es6导入
      format: 'amd',//输出格式 amd es6 iife umd cjs
      name: 'ofdTs',//当format为iife和umd时必须提供，将作为全局变量挂在window(浏览器环境)下：window.A=...
      sourcemap: true, // ts中的sourcemap也得变为true
    },
    // {
    //   file: './dist/lib-umd.js',
    //   format: 'umd',
    //   name: 'myLib'
    // },
    // {
    //   file: './dist/lib-es.js',
    //   format: 'es'
    // },
    // {
    //   file: './dist/lib-cjs.js',
    //   format: 'cjs'
    // }
  ],
  global:{
    // 'jquery':'$' //告诉rollup 全局变量$即是jquery
  },
//   onwarn: function (warning, warn) {
// // Silence circular dependency warning for moment package
// //     if (
// //       warning.code === 'CIRCULAR_DEPENDENCY'
// //       && !warning.importer.indexOf(path.normalize('node_modules/jszip/src/lib/'))
// //     ) {
// //       return
// //     }
// //
// //     console.warn(`(!) ${warning.message}`)
//   },
  // 这个插件是有执行顺序的
  plugins: [
    alias({
      entries: [
        {
          find: 'src',
          replacement: path.resolve(projectRootDir, 'src')
          // OR place `customResolver` here. See explanation below.
        }
      ],
      // customResolver
    }),
    // inject({
    //   Promise: ['es6-promise', 'Promise']
    // }),
    // nodePolyfills(),
    globals(),
    builtins({
      preferBuiltins: true,
    }),
    nodeResolve({
      preferBuiltins: true,
      extensions: ['.js', '.ts', '.tsx'],
    }),
    // replace({
    //   delimiters: ['', ''],
    //   values: {
    //     'jszip': 'JSZip'
    //   }
    // }),
    commonjs(), // 有时，报循环依赖错误，没有时，Error: 'default' is not exported by node_modules/jszip/lib/index.js, imported by src/main.ts
    //
    // eslint
    eslint({
      throwOnError: false,
      include: ['src/**/*.ts'],
      exclude: ['node_modules/**', 'dist/**', 'src/styles/**']
    }),
    babel({
      exclude: 'node_modules/**',
      runtimeHelpers: true,
    }),
    ts({
      tsconfig: path.resolve(__dirname, 'tsconfig.json')
    }),
    // todo
    postcss({
      plugins: [
        autoprefixer(),// css3 加前缀
        cssnano(), //对打包后的css进行压缩
      ],
      extract: 'css/index.css' // 配置了extract，就会将css抽离成单独的文件。
    }),
    serve({
      port: 3388,//端口号，默认10001
      contentBase: '', // 表示起的服务是在根目录下  //服务器启动的文件夹，默认是项目根目录，需要在该文件下创建index.html
      openPage: '/public/index.html', // 打开的是哪个文件
      // open: true // 默认打开浏览器
    }),
    livereload(),
  ],
  external:[
    // 'lodash',
    'jszip',
    // 'readable-stream',
    // 'readable-stream/transform'
  ], //告诉rollup不要将此lodash打包，而作为外部依赖
  // dynamicRequireTargets: [
  //   '**/node_modules/jszip/**/*.js', // jszip Circular dependency  useless
  // ],
  transformMixedEsModules: true,
}
