module.exports = {
  extends: ['../../node_modules/@s-ui/lint/eslintrc.js'],
  env: {
    node: true,
    browser: true,
    es2020: true,
  },
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
    project: './tsconfig.json',
  },
  rules: {
    // Inherit root rules with client-specific overrides
    '@typescript-eslint/strict-boolean-expressions': 0,
    '@typescript-eslint/no-non-null-assertion': 0,
    '@typescript-eslint/no-misused-promises': 0,
    '@typescript-eslint/restrict-plus-operands': 0,
    '@typescript-eslint/switch-exhaustiveness-check': 'error',
    
    // Client-specific rules
    '@typescript-eslint/explicit-function-return-type': 'warn',
    '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    'prefer-const': 'error',
    'no-var': 'error',
  },
  ignorePatterns: [
    'dist/',
    'node_modules/',
    '*.js', // Allow this config file
  ],
}