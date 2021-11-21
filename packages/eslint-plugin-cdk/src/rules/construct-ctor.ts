import {
  ASTUtils,
  TSESTree,
  AST_NODE_TYPES,
} from '@typescript-eslint/experimental-utils';

import {
  createRule,
  hasConstructSuperClass,
  isEqualMethodSignatur,
  MethodSignaturParameter,
} from '../utils';

export default createRule({
  name: 'construct-ctor',
  meta: {
    docs: {
      description: 'Ensure a uniform construct constructors signature',
      recommended: 'error',
    },
    messages: {
      constructCtor:
        'Signature of all construct constructors should be "scope, id, props"',
    },
    schema: [],
    type: 'problem',
  },
  defaultOptions: [],
  create(context) {
    const sourceCode = context.getSourceCode();

    let isConstruct = false;

    const getIdentifier = (node: TSESTree.Parameter) =>
      node.type === AST_NODE_TYPES.AssignmentPattern ? node.left : node;

    return {
      'ClassDeclaration[superClass]'(node: TSESTree.ClassDeclaration): void {
        isConstruct = hasConstructSuperClass(node);
      },
      'MethodDefinition[key.name = "constructor"]'(
        node: TSESTree.MethodDefinition,
      ): void {
        if (!isConstruct) {
          return;
        }

        if (node.value.params.length === 0) {
          context.report({
            node,
            messageId: 'constructCtor',
          });

          return;
        }

        const expected: MethodSignaturParameter[] = [];

        expected.push({ name: 'scope', type: 'Construct' });
        expected.push({ name: 'id', type: 'string' });

        if (node.value.params.length > 2) {
          expected.push({ name: 'props' });
        }

        const actual: MethodSignaturParameter[] = [];
        let start = node.value.params[0].loc.start;
        let end = node.value.params[0].loc.end;

        node.value.params.forEach((param, index) => {
          if (index === 0) {
            start = param.loc.start;
          }
          end = param.loc.end;

          const identifier = getIdentifier(param);

          if (ASTUtils.isIdentifier(identifier)) {
            const type = sourceCode.getLastToken(identifier)?.value;
            actual.push({ name: identifier.name, type });
          }
        });

        if (!isEqualMethodSignatur(expected, actual)) {
          context.report({
            node,
            loc: {
              start,
              end,
            },
            messageId: 'constructCtor',
          });

          return;
        }
      },
    };
  },
});
