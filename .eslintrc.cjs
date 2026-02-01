/* eslint-env node */
module.exports = {
  root: true,
  ignorePatterns: ['dist', 'node_modules', '*.cjs'],
  env: {
    node: true,
    es2022: true,
  },
  extends: ['eslint:recommended', 'plugin:vue/vue3-recommended', 'prettier'],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  rules: {
    'vue/multi-word-component-names': 'off',
  },
}
