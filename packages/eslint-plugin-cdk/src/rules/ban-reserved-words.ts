import * as path from 'path';
import {
  ASTUtils,
  TSESTree,
  AST_NODE_TYPES,
} from '@typescript-eslint/experimental-utils';

import { createRule, isJsiiProject } from '../utils';

export type Options = [{ wordList: string[]; jsiiOnly: boolean }];
export type MessageIds = 'bannedReservedWordMessage';

export default createRule<Options, MessageIds>({
  name: 'ban-reserved-words',
  meta: {
    docs: {
      description: 'Bans specific words from being used',
      recommended: 'error',
    },
    messages: {
      bannedReservedWordMessage:
        'Using `{{word}}` may cause problems when generating language bindings. Consider using a different name.',
    },
    schema: [
      {
        properties: {
          wordList: {
            type: 'array',
          },
          jsiiOnly: {
            type: 'boolean',
          },
        },
        additionalProperties: false,
      },
    ],
    type: 'suggestion',
  },
  defaultOptions: [{ wordList: [], jsiiOnly: true }],
  create(context, optionsWithDefaults) {
    const { wordList, jsiiOnly } = optionsWithDefaults[0];

    if (jsiiOnly) {
      const cwd = path.dirname(context.getFilename());
      if (!isJsiiProject(cwd)) return {};
    }

    if (wordList.length === 0) return {};

    const reservedWordSet = new Set(wordList);

    let isExportedInterface = false;

    const isExported = (node: TSESTree.TSInterfaceDeclaration): void => {
      isExportedInterface =
        node.parent?.type === AST_NODE_TYPES.ExportNamedDeclaration;
    };

    const checkName = (node: TSESTree.Identifier): void => {
      if (reservedWordSet.has(node.name)) {
        context.report({
          node: node,
          messageId: 'bannedReservedWordMessage',
          data: {
            word: node.name,
          },
        });
      }
    };

    const checkNameOfMembers = (
      node: TSESTree.TSInterfaceBody | TSESTree.TSTypeLiteral,
    ): void => {
      if (!isExportedInterface) return;

      const members =
        node.type === AST_NODE_TYPES.TSInterfaceBody ? node.body : node.members;

      members.forEach((member) => {
        if (
          member.type === AST_NODE_TYPES.TSPropertySignature &&
          ASTUtils.isIdentifier(member.key)
        ) {
          checkName(member.key);
        }
      });
    };

    return {
      TSInterfaceDeclaration: isExported,
      TSInterfaceBody: checkNameOfMembers,
    };
  },
});
