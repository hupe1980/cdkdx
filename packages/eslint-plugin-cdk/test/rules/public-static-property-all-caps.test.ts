import rule from '../../src/rules/public-static-property-all-caps';
import { RuleTester } from '../rule-tester';

const ruleTester = new RuleTester({
  parser: '@typescript-eslint/parser',
});

ruleTester.run('public-static-property-all-caps', rule, {
  valid: [
    {
      code: `
      class Test {
          public static readonly FOO = 'bar';
      }
      `,
    },
    {
      code: `
      class Test  {
        public static readonly FOO_BAR = 'bar';
          
      }
      `,
    },
    {
      code: `
      class Test  {
        public readonly foo = 'bar';
          
      }
      `,
    },
  ],
  invalid: [
    {
      code: `
      class Test {
          public static readonly foo = 'bar';
      }
      `,
      errors: [
        {
          messageId: 'allCaps',
        },
      ],
    },
    {
      code: `
      class Test extends Construct {
          public static readonly fooBar = 'bar';
      }
      `,
      errors: [
        {
          messageId: 'allCaps',
        },
      ],
    },
  ],
});
