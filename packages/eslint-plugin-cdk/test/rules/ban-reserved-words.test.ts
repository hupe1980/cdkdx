import * as path from 'path';
import rule from '../../src/rules/ban-reserved-words';
import { RuleTester } from '../rule-tester';

const ruleTester = new RuleTester({
  parser: '@typescript-eslint/parser',
  parserOptions: {
    sourceType: 'module',
  },
});

const jsiiFile = path.join(
  process.cwd(),
  'test',
  'fixtures',
  'jsii-construct',
  'src',
  'construct.ts',
);

const nonJsiiFile = path.join(
  process.cwd(),
  'test',
  'fixtures',
  'construct',
  'src',
  'construct.ts',
);

ruleTester.run('ban-reserverd-words', rule, {
  valid: [
    {
      filename: jsiiFile,
      code: `
        export interface Api {
          foo: string;
          bar: string;
        }
      `,
      options: [
        {
          wordList: [],
          jsiiOnly: true,
        },
      ],
    },
    {
      filename: jsiiFile,
      code: `
        export interface Api {
          foo: string;
          bar: string;
        }
      `,
      options: [
        {
          wordList: ['lambda'],
          jsiiOnly: true,
        },
      ],
    },
    {
      filename: nonJsiiFile,
      code: `
        export interface Api {
          foo: string;
          lambda: string;
        }
      `,
      options: [
        {
          wordList: ['lambda'],
          jsiiOnly: true,
        },
      ],
    },
  ],
  invalid: [
    {
      filename: jsiiFile,
      code: `
        export interface Api {
          foox: string;
          lambda: string;
        }
      `,
      options: [
        {
          wordList: ['lambda'],
          jsiiOnly: true,
        },
      ],
      errors: [
        {
          messageId: 'bannedReservedWordMessage',
          data: {
            word: 'lambda',
          },
        },
      ],
    },
    {
      filename: nonJsiiFile,
      code: `
        export interface Api {
          foo: string;
          lambda: string;
        }
      `,
      options: [
        {
          wordList: ['lambda'],
          jsiiOnly: false,
        },
      ],
      errors: [
        {
          messageId: 'bannedReservedWordMessage',
          data: {
            word: 'lambda',
          },
        },
      ],
    },
  ],
});
