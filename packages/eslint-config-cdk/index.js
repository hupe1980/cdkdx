'use strict';

module.exports = {
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    //'plugin:@typescript-eslint/recommended-requiring-type-checking',
  ],
  parserOptions: {
    ecmaVersion: '2018',
    sourceType: 'module',
    project: 'tsconfig.eslint.json',
  },
  plugins: ['jest', 'import', '@typescript-eslint'],
  ignorePatterns: ['*.js', '*.d.ts', 'node_modules'],
  rules: {
    '@typescript-eslint/interface-name-prefix': 'off',
    '@typescript-eslint/no-use-before-define': 'off',

    // Require use of the `import { foo } from 'bar';` form instead of `import foo = require('bar');`
    '@typescript-eslint/no-require-imports': ['error'],
    '@typescript-eslint/no-unused-vars': [
      'error',
      {
        vars: 'all',
        args: 'after-used',
        ignoreRestSiblings: false,
        argsIgnorePattern: '^_',
      },
    ],

    //Style
    semi: 'off', // note you must disable the base rule as it can report incorrect errors
    '@typescript-eslint/semi': ['error'],
    
    indent: 'off', // note you must disable the base rule as it can report incorrect errors
    '@typescript-eslint/indent': ['error', 2],
    
    quotes: ['error', 'single', { avoidEscape: true }],
    'comma-dangle': ['error', 'always-multiline'], // ensures clean diffs, see https://medium.com/@nikgraf/why-you-should-enforce-dangling-commas-for-multiline-statements-d034c98e36f8

    // Allow use of Function (@aws-cdk/aws-lambda)
    '@typescript-eslint/no-implied-eval': 'off',

    // Require all imported dependencies are actually declared in package.json
    'import/no-extraneous-dependencies': [
      'error',
      {
        devDependencies: [
          // Only allow importing devDependencies from:
          '**/__tests__/**/**', // --> Unit tests
          '**/lambdas/**/**', // --> Lambdas
        ],
        optionalDependencies: false, // Disallow importing optional dependencies (those shouldn't be in use in the project)
        peerDependencies: false, // Disallow importing peer dependencies (that aren't also direct dependencies)
      },
    ],
    'jest/expect-expect': [
      'warn',
      {
        assertFunctionNames: ['expect', 'expectCDK'],
      },
    ],
    'jest/consistent-test-it': [
      'error',
      { 
        fn: 'test' 
      }
    ],
    'jest/no-identical-title': 'error',
  },
};