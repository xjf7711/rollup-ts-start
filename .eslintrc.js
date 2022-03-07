const path = require('path')
const resolve = _path => path.resolve(__dirname, _path)
const DOMGlobals = ['window', 'document']
const NodeGlobals = ['module', 'require']

module.exports = {
  env: {
    browser: true,
    es6: true
  },
  parser: '@typescript-eslint/parser', // 配置ts解析器
  extends: [
    'plugin:@typescript-eslint/recommended'
  ],
  parserOptions: {
    project: resolve('./tsconfig.json'),
    tsconfigRootDir: resolve('./'),
    ecmaVersion: 2019,
    sourceType: 'module',
    createDefaultProgram: true,
  },
  // plugins: ['prettier'],
  rules: {
    // 'indent': ['error', 2],
    // 'no-unused-vars': 'error',
    // 'no-restricted-globals': ['error', ...DOMGlobals, ...NodeGlobals],
    'no-console': 'off',
  }
};
