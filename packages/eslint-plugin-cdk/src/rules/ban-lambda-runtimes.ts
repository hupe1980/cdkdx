import { TSESTree, ASTUtils } from '@typescript-eslint/experimental-utils';

import { createRule, hasConstructSuperClass } from '../utils';

export type Options = [{ bannedRuntimes: string[] }];
export type MessageIds = 'bannedLambdaRuntimeMessage';

export default createRule<Options, MessageIds>({
  name: 'ban-lambda-runtimes',
  meta: {
    docs: {
      description: 'Bans specific lambda runtimes from being used',
      category: 'Best Practices',
      recommended: 'error',
    },
    messages: {
      bannedLambdaRuntimeMessage: "Don't use `{{runtime}}` as a runtime.",
    },
    schema: [
      {
        properties: {
          bannedRuntimes: {
            type: 'array',
          },
        },
        additionalProperties: false,
      },
    ],
    type: 'suggestion',
  },
  defaultOptions: [{ bannedRuntimes: [] }],
  create(context, optionsWithDefaults) {
    const { bannedRuntimes } = optionsWithDefaults[0];

    let isConstruct = false;

    if (bannedRuntimes.length === 0) return {};

    const hasName = (node: TSESTree.Expression, name: string): boolean =>
      ASTUtils.isIdentifier(node) && node.name === name;

    const checkRuntime = (node: TSESTree.Expression): void => {
      if (ASTUtils.isIdentifier(node)) {
        const runtime = node.name;

        if (bannedRuntimes.includes(runtime)) {
          context.report({
            node: node,
            messageId: 'bannedLambdaRuntimeMessage',
            data: {
              runtime,
            },
          });
        }
      }
    };

    return {
      'ClassDeclaration[superClass]'(node: TSESTree.ClassDeclaration): void {
        isConstruct = hasConstructSuperClass(node);
      },
      MemberExpression(node: TSESTree.MemberExpression) {
        if (!isConstruct) {
          return;
        }

        if (ASTUtils.isMemberOrOptionalMemberExpression(node.object)) {
          if (
            hasName(node.object.object, 'lambda') &&
            hasName(node.object.property, 'Runtime')
          ) {
            checkRuntime(node.property);
          }
          return;
        }

        if (hasName(node.object, 'Runtime')) {
          checkRuntime(node.property);
          return;
        }
      },
    };
  },
});
