import path from 'path';
import { createRule } from '../utils';

export type Options = [{ pattern: string }];
export type MessageIds = 'namingConvention';

export default createRule<Options, MessageIds>({
  name: 'filename-match-regex',
  meta: {
    docs: {
      description: 'Enforces all linted files to match a certain pattern',
      category: 'Best Practices',
      recommended: 'error',
    },
    messages: {
      namingConvention:
        'Filename {{ name }} does not match the naming convention.',
    },
    schema: [
      {
        properties: {
          pattern: {
            type: 'string',
          },
        },
        additionalProperties: false,
      },
    ],
    type: 'problem',
  },
  defaultOptions: [
    { pattern: '^([a-z][a-z0-9]*)(-[a-z0-9]+)*(.spec|.test)?.ts$' },
  ],
  create(context, optionsWithDefaults) {
    const filename = context.getFilename();

    return {
      Program(node): void {
        const { base } = path.parse(filename);

        if (base === 'index.ts') return;

        const regExp = new RegExp(optionsWithDefaults[0].pattern);

        if (!regExp.test(base)) {
          context.report({
            node,
            messageId: 'namingConvention',
            data: {
              name: base,
            },
          });
        }
      },
    };
  },
});
