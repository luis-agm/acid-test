module.exports = {
  root: true,
  parserOptions: {
    sourceType: 'module'
  },
  env: {
    browser: true,
  },
  extends: 'standard',
  plugins: [
    'import',
    'async-await'
  ],
  'rules': {
    'arrow-parens': 0,
    'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0,
    'space-in-parens': ['error', 'always'],
    'no-use-before-define': 0,
    'generator-star-spacing': 0,
    'object-curly-spacing': ["error", "always"]
  }
}