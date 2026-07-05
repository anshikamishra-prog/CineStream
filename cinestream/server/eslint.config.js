export default {
  env: {
    es2022: true,
    node: true,
  },
  extends: ['eslint:recommended'],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  rules: {
    'no-console': ['warn', { allow: ['warn', 'error', 'info'] }],
    'no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    'no-var': 'error',
    'prefer-const': 'error',
    'prefer-arrow-callback': 'error',
    eqeqeq: ['error', 'always'],
    curly: ['error', 'all'],
    'no-return-await': 'error',
    'no-throw-literal': 'error',
    'handle-callback-err': 'error',
  },
};
