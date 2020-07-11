import rule from '../../src/rules/stack-props-struct-name';
import { RuleTester } from '../rule-tester';

const ruleTester = new RuleTester({
  parser: '@typescript-eslint/parser',
});

ruleTester.run('stack-props-struct-name', rule, {
  valid: [
    {
      code: `
      class TestStack extends Stack {
          constructor(scope: Construct, id: string, props: TestStackProps) {}
      }
      `,
    },
    {
      code: `
      class TestStack extends Stack {
          constructor(scope: Construct, id: string, props: StackProps) {}
      }
      `,
    },
    {
      code: `
      class TestStack extends Construct {
          constructor(scope: Construct, id: string) {}
      }
      `,
    },
    {
      code: `
      class TestStack {
          constructor(foo: string) {}
      }
      `,
    },
    {
      code: `
      class TestStack extends Stack {
          constructor(scope: Construct, id: string, props: TestStackProps = {}) {}
      }
      `,
    },
  ],
  invalid: [
    {
      code: `
      class TestStack extends Stack {
          constructor(parent: Construct, id: string, props: XXXProps) {}
      }
      `,
      errors: [
        {
          messageId: 'stackPropsStructNname',
        },
      ],
    },
  ],
});
