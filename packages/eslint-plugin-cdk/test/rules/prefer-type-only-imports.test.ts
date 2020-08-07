import rule from '../../src/rules/prefer-type-only-imports';
import { RuleTester } from '../rule-tester';

const ruleTester = new RuleTester({
  parser: '@typescript-eslint/parser',
  parserOptions: {
    sourceType: 'module',
  },
});

ruleTester.run('prefer-type-only-imports', rule, {
  valid: [
    {
      code: `
        import type { Handler } from 'aws-lambda';
      `,
      options: [
        {
          moduleNames: ['aws-lambda'],
        },
      ],
    },
    {
      code: `
        import { Handler } from 'aws-lambda';
      `,
      options: [
        {
          moduleNames: [],
        },
      ],
    },
  ],
  invalid: [
    {
      code: `
        import { Handler } from 'aws-lambda';
      `,
      options: [
        {
          moduleNames: ['aws-lambda'],
        },
      ],
      errors: [
        {
          messageId: 'preferTypeOnlyImports',
          data: {
            name: 'aws-lambda',
          },
        },
      ],
    },
  ],
});
