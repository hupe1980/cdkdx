import rule from '../../src/rules/filename-match-regex';
import { RuleTester } from '../rule-tester';

const ruleTester = new RuleTester({
  parser: '@typescript-eslint/parser',
});

const code = '{}';

ruleTester.run('filename-match-regex', rule, {
  valid: [
    {
      code,
      filename: 'index.ts',
    },
    {
      code,
      filename: 'index.tsx',
    },
    {
      code,
      filename: 'test.ts',
    },
    {
      code,
      filename: 'foo-bar.ts',
    },
    {
      code,
      filename: 'foo-bar.test.ts',
    },
    {
      code,
      filename: 'jest.config.ts',
    },
    {
      code,
      filename: 'jest.config.js',
    },
    {
      code,
      filename: 'xyz.xyz',
      options: [
        {
          pattern: '^([a-z][a-z0-9]*)(-[a-z0-9]+)*(.spec|.test)?.ts$',
          ignoredFiles: ['xyz.xyz'],
        },
      ],
    },
  ],
  invalid: [
    {
      code,
      filename: 'Test.ts',
      errors: [
        {
          messageId: 'namingConvention',
          data: {
            name: 'Test.ts',
          },
        },
      ],
    },
    {
      code,
      filename: 'FooBar.ts',
      errors: [
        {
          messageId: 'namingConvention',
          data: {
            name: 'FooBar.ts',
          },
        },
      ],
    },
  ],
});
