import rule from '../../src/rules/no-static-import';
import { RuleTester } from '../rule-tester';

const ruleTester = new RuleTester({
  parser: '@typescript-eslint/parser',
});

ruleTester.run('no-static-import', rule, {
  valid: [
    {
      code: `
      class Test extends Construct {
        public static foo() {
          return 'bar';
        }
      }
      `,
    },
    {
      code: `
      class Test {
        public static import() {
          return 'bar';
        }
          
      }
      `,
    },
  ],
  invalid: [
    {
      code: `
      class Test extends Construct {
        public static import() {
          return 'bar';
        }
      }
      `,
      errors: [{
        messageId: 'staticImport',
      },
      ],
    },
  ],
});