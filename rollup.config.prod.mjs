import path from 'path'
import alias from "@rollup/plugin-alias";
import {nodeResolve} from '@rollup/plugin-node-resolve';
import ts from 'rollup-plugin-typescript2'
// import serve from 'rollup-plugin-serve'
import commonjs from 'rollup-plugin-commonjs' // commonjs模块转换插件
import {terser} from 'rollup-plugin-terser';
import {eslint} from 'rollup-plugin-eslint' // eslint插件
// import postcss from 'rollup-plugin-postcss'
import babel from 'rollup-plugin-babel'
// import livereload from 'rollup-plugin-livereload'

// `npm run build` -> `production` is true
// `npm run dev` -> `production` is false
const production = !process.env.ROLLUP_WATCH;

const projectRootDir = path.resolve(__dirname);
import packageJSON from './package.json'

// 需要导出的模块类型
const outputMap = [
  {
    file: packageJSON.main, // 通用模块
    format: 'umd',
  },
  {
    file: packageJSON.module, // es6模块
    format: 'es',
  }
]

export default {
  input: path.resolve(__dirname, 'src/main.ts'),//入口文件
  output: {
    file: path.resolve(__dirname, 'dist/bundle.js'),//打包后的存放文件
    // global: 弄个全局变量来接收
    // cjs: module.exports
    // esm: export default
    // iife: ()()
    // umd: 兼容 amd + commonjs 不支持es6导入
    format: 'iife',//输出格式 amd es6 iife umd cjs
    name: 'bundleName',//当format为iife和umd时必须提供，将作为全局变量挂在window(浏览器环境)下：window.A=...
    // sourcemap: true, // ts中的sourcemap也得变为true
  },
  global:{
    // 'jquery':'$' //告诉rollup 全局变量$即是jquery
  },
  plugins: [ // 这个插件是有执行顺序的
    alias({
      entries: [
        {
          find: 'src',
          replacement: path.resolve(projectRootDir, 'src')
          // OR place `customResolver` here. See explanation below.
        }
      ],
      customResolver
    }),
    ts({
      tsconfig: path.resolve(__dirname, 'tsconfig.json')
    }),
    nodeResolve({
      extensions: ['.js', '.ts', '.tsx'],
    }),
    commonjs(),
// eslint
    eslint({
      throwOnError: true,
      include: ['src/**/*.ts'],
      exclude: ['node_modules/**', 'lib/**']
    }),
    babel({
      exclude: 'node_modules/**'
    }),
    production && terser(), // minify, but only in production
    // todo
    // postcss(),
    // livereload(),
    // serve({
    //   port: 3008,
    //   contentBase: '', // 表示起的服务是在根目录下
    //   openPage: '/public/index.html', // 打开的是哪个文件
    //   // open: true // 默认打开浏览器
    // })
  ],
  external:[
    // 'lodash'
  ], //告诉rollup不要将此lodash打包，而作为外部依赖
}

// export default outputMap.map(output => buildConf({ output: {name: packageJSON.name, ...output}
