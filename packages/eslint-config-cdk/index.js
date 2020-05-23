'use strict';

module.exports = {
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:jest/recommended',
    'plugin:import/typescript'
  ],
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
        argsIgnorePattern: '^_'
      }
    ],
    // Require all imported dependencies are actually declared in package.json
    "import/no-extraneous-dependencies": [
      "error",
      {
        "devDependencies": [
          // Only allow importing devDependencies from:
          "**/test/**", // --> Unit tests
          "**/lambdas/**", // --> Lambdas
        ],
        "optionalDependencies": false, // Disallow importing optional dependencies (those shouldn't be in use in the project)
        "peerDependencies": false // Disallow importing peer dependencies (that aren't also direct dependencies)
      }
    ]
  }
};