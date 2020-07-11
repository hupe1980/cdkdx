import rule from '../../src/rules/construct-props-struct-name';
import { RuleTester } from '../rule-tester';

const ruleTester = new RuleTester({
  parser: '@typescript-eslint/parser',
});

ruleTester.run('construct-props-struct-name', rule, {
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
      class Test extends cdk.Construct {
          constructor(scope: cdk.Construct, id: string, props: TestProps) {}
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
          messageId: 'constructPropsStructNname',
        },
      ],
    },
  ],
});
