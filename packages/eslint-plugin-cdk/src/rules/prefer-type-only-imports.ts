import { TSESTree } from '@typescript-eslint/experimental-utils';
import { createRule } from '../utils';

export type Options = [{ moduleNames: string[] }];
export type MessageIds = 'preferTypeOnlyImports';

export default createRule<Options, MessageIds>({
  name: 'prefer-type-only-imports',
  meta: {
    docs: {
      description: 'Enforce type only imports',
      recommended: 'error',
    },
    messages: {
      preferTypeOnlyImports:
        'Package `{{name}}` should be imported as type only import',
    },
    schema: [
      {
        properties: {
          moduleNames: {
            type: 'array',
          },
        },
        additionalProperties: false,
      },
    ],
    type: 'problem',
  },
  defaultOptions: [{ moduleNames: [] }],
  create(context, optionsWithDefaults) {
    const { moduleNames } = optionsWithDefaults[0];

    if (moduleNames.length === 0) return {};

    const moduleNameSet = new Set(moduleNames);

    return {
      ImportDeclaration(node: TSESTree.ImportDeclaration): void {
        if (
          moduleNameSet.has(node.source.value as string) &&
          node.importKind !== 'type'
        ) {
          context.report({
            node,
            messageId: 'preferTypeOnlyImports',
            data: {
              name: node.source.value,
            },
          });
        }
      },
    };
  },
});
