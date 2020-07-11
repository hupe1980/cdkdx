import rule from '../../src/rules/ban-lambda-runtimes';
import { RuleTester } from '../rule-tester';

const ruleTester = new RuleTester({
  parser: '@typescript-eslint/parser',
  parserOptions: {
    sourceType: 'module',
  },
});

ruleTester.run('ban-lambda-runtimes', rule, {
  valid: [
    {
      code: `
        class Test extends Construct {
          constructor(scope: Construct, id: string, props: TestProps) {
            new Function(this, 'Lambda1', {
              runtime: Runtime.NODEJS_12_X,
              handler: 'index.handler',
              code: Code.fromAsset(path.join(__dirname, 'lambdas', 'lambda1')),
            });
          }
        }
      `,
      options: [
        {
          bannedRuntimes: ['NODEJS_10_X'],
        },
      ],
    },
    {
      code: `
        class Test extends cdk.Construct {
          constructor(scope: cdk.Construct, id: string, props: TestProps) {
            new lambda.Function(this, 'Lambda1', {
              runtime: lambda.Runtime.NODEJS_12_X,
              handler: 'index.handler',
              code: lambda.Code.fromAsset(path.join(__dirname, 'lambdas', 'lambda1')),
            });
          }
        }
      `,
      options: [
        {
          bannedRuntimes: ['NODEJS_10_X'],
        },
      ],
    },
  ],
  invalid: [
    {
      code: `
        class Test extends Construct {
          constructor(scope: Construct, id: string, props: TestProps) {
            new Function(this, 'Lambda1', {
              runtime: Runtime.NODEJS_10_X,
              handler: 'index.handler',
              code: Code.fromAsset(path.join(__dirname, 'lambdas', 'lambda1')),
            });
          }
        }
      `,
      options: [
        {
          bannedRuntimes: ['NODEJS_10_X'],
        },
      ],
      errors: [
        {
          messageId: 'bannedLambdaRuntimeMessage',
          data: {
            runtime: 'NODEJS_10_X',
          },
        },
      ],
    },
    {
      code: `
        class Test extends cdk.Construct {
          constructor(scope: cdk.Construct, id: string, props: TestProps) {
            new lambda.Function(this, 'Lambda1', {
              runtime: lambda.Runtime.NODEJS_10_X,
              handler: 'index.handler',
              code: lambda.Code.fromAsset(path.join(__dirname, 'lambdas', 'lambda1')),
            });
          }
        }
      `,
      options: [
        {
          bannedRuntimes: ['NODEJS_10_X'],
        },
      ],
      errors: [
        {
          messageId: 'bannedLambdaRuntimeMessage',
        },
      ],
    },
  ],
});
