'use strict';

function safeRequire(p) {
  try {
    return require(p)
  } catch (err) {
    if (err.code === 'MODULE_NOT_FOUND' && ~err.message.indexOf(p)) return undefined
    else throw err
  }
}

// const { PYTHON_RESERVED } = safeRequire('jsii/lib/reserved-words');

module.exports = {
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended', 
    'plugin:@typescript-eslint/recommended-requiring-type-checking', 
    'prettier/@typescript-eslint',
    'prettier'
  ],
  parserOptions: {
    ecmaVersion: '2018',
    sourceType: 'module',
    project: 'tsconfig.eslint.json',
    warnOnUnsupportedTypeScriptVersion: true,
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
    '@typescript-eslint/no-unsafe-member-access': 'off',
    '@typescript-eslint/no-unsafe-assignment': 'off',
    '@typescript-eslint/no-unsafe-call': 'off',
    '@typescript-eslint/no-unsafe-return': 'off',
    '@typescript-eslint/restrict-template-expressions': 'off',
    '@typescript-eslint/require-await': 'off',
    
    // Allow new (lambda) Function
    '@typescript-eslint/no-implied-eval': 'off',

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

    '@typescript-eslint/member-ordering': ['error', {
      default: [
        "public-static-field",
        "public-static-method",
        "protected-static-field",
        "protected-static-method",
        "private-static-field",
        "private-static-method",
        "field",
        "constructor", // = ["public-constructor", "protected-constructor", "private-constructor"]
        "method",
      ]
    }],

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
    'cdk/prefer-type-only-imports': [
      'error',
      {
        moduleNames: ['aws-lambda'],
      }
    ],
    // 'cdk/ban-reserved-words': [
    //   'error', 
    //   {
    //     wordList: [...PYTHON_RESERVED] || [],
    //     jsiiOnly: true,
    //   }
    // ],

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

    'import/order': ['error', {
      groups: ['builtin', 'external', 'parent', 'sibling', 'index'],
      alphabetize: { order: 'asc', caseInsensitive: true },
    }],

    'no-duplicate-imports': ['error'],

    'jest/expect-expect': [
      'error',
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
    'jest/valid-expect': 'error',
    'jest/valid-expect-in-promise': 'error',
    'jest/no-test-prefixes': 'error',

    //Jest Style
    'jest/prefer-to-be-null': 'error',
    'jest/prefer-to-be-undefined': 'error',
    'jest/prefer-to-contain': 'error',
    'jest/prefer-to-have-length': 'error',
    
    //Style
    'prettier/prettier': ['error', { 
      'tabWidth': 2,
      'singleQuote': true, 
      'printWidth': 150,
      'semi': true,
      'trailingComma': 'all', // ensures clean diffs, see https://medium.com/@nikgraf/why-you-should-enforce-dangling-commas-for-multiline-statements-d034c98e36f8
    }],
  },
};
