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
