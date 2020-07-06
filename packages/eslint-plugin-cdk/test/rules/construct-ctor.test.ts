import rule from '../../src/rules/construct-ctor';
import { RuleTester } from '../rule-tester';

const ruleTester = new RuleTester({
  parser: '@typescript-eslint/parser',
});

ruleTester.run('construct-ctor', rule, {
  valid: [
    {
      code: `
      class Test extends Construct {
          constructor(scope: Construct, id: string, props: TestProps) {}
      }
      `,
    },
    {
      code: `
      class Test extends Construct {
          constructor(scope: Construct, id: string) {}
      }
      `,
    },
    {
      code: `
      class Test {
          constructor(foo: string) {}
      }
      `,
    },
  ],
  invalid: [
    {
      code: `
      class Test extends Construct {
          constructor(parent: Construct, id: string, props: TestProps) {}
      }
      `,
      errors: [{
        messageId: 'constructCtor',
      },
      ],
    },
  ],
});