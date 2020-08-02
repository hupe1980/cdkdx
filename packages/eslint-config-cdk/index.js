'use strict';

module.exports = {
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',  
    'prettier/@typescript-eslint',
    'prettier'
  ],
  parserOptions: {
    ecmaVersion: '2018',
    sourceType: 'module',
    project: 'tsconfig.eslint.json',
  },
  plugins: ['@typescript-eslint', 'cdk', 'import', 'jest', 'prettier'],
  ignorePatterns: ['*.js', '*.d.ts', 'node_modules'],
  settings: {
    'import/parsers': {
      '@typescript-eslint/parser': ['.ts', '.tsx']
    },
    'import/external-module-folders': ['node_modules', 'node_modules/@types'],
    'import/resolver': {
      'typescript': {
        'project': 'tsconfig.eslint.json'
      },
    }
  },
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

    'cdk/ban-lambda-runtimes': [
      'error', 
      { 
        bannedRuntimes: [
          'NODEJS',
          'NODEJS_4_3',
          'NODEJS_6_10',
          'NODEJS_8_10',
          'NODEJS_10_X',
          'DOTNET_CORE_1',
          'DOTNET_CORE_2',
        ]
      }
    ],
    'cdk/construct-ctor': 'error',
    'cdk/construct-props-struct-name': 'error',
    'cdk/filename-match-regex': 'error',
    'cdk/public-static-property-all-caps': 'error',
    'cdk/no-static-import': 'error',
    'cdk/stack-props-struct-name': 'error',

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
    'import/no-unresolved': ['error', { ignore: ['aws-lambda'] }],

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
    
    //Style
    'prettier/prettier': ['error', { 
      'tabWidth': 2,
      'singleQuote': true, 
      'semi': true,
      'trailingComma': 'all', // ensures clean diffs, see https://medium.com/@nikgraf/why-you-should-enforce-dangling-commas-for-multiline-statements-d034c98e36f8
    }]
  },
};