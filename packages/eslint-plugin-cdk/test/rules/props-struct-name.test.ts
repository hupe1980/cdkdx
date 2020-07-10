import rule from '../../src/rules/props-struct-name';
import { RuleTester } from '../rule-tester';

const ruleTester = new RuleTester({
  parser: '@typescript-eslint/parser',
});

ruleTester.run('props-struct-name', rule, {
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
    {
      code: `
      class Test extends Construct {
          constructor(scope: Construct, id: string, props: TestProps = {}) {}
      }
      `,
    },
  ],
  invalid: [
    {
      code: `
      class Test extends Construct {
          constructor(parent: Construct, id: string, props: XXXProps) {}
      }
      `,
      errors: [
        {
          messageId: 'propsStructNname',
        },
      ],
    },
  ],
});
