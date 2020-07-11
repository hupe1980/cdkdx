import { TSESTree } from '@typescript-eslint/experimental-utils';
import { createRule, hasConstructSuperClass } from '../utils';

export default createRule({
  name: 'no-static-import',
  meta: {
    docs: {
      description: 'Enforce cdk guidelines',
      category: 'Best Practices',
      recommended: 'error',
    },
    messages: {
      staticImport:
        'Static "import" methods are deprecated in favor of "fromAttributes"',
    },
    schema: [],
    type: 'problem',
  },
  defaultOptions: [],
  create(context) {
    let isConstruct = false;

    return {
      'ClassDeclaration[superClass]'(node: TSESTree.ClassDeclaration): void {
        isConstruct = hasConstructSuperClass(node);
      },
      MethodDefinition(node: TSESTree.MethodDefinition): void {
        if (
          !isConstruct ||
          !node.static ||
          !(node.accessibility === 'public')
        ) {
          return;
        }

        const sourceCode = context.getSourceCode();
        const name = sourceCode.getText(node.key);

        if (name === 'import') {
          context.report({
            node,
            messageId: 'staticImport',
          });
        }
      },
    };
  },
});
