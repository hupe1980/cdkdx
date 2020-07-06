import {
  AST_NODE_TYPES, TSESTree,
} from '@typescript-eslint/experimental-utils';
import { createRule } from '../utils';

export default createRule({
  name: 'no-static-import',
  meta: {
    docs: {
      description: 'Enforce cdk guidelines',
      category: 'Best Practices',
      recommended: 'error',
    },
    messages: {
      staticImport: 'Static "import" methods are deprecated in favor of "fromAttributes"',
    },
    schema: [],
    type: 'problem',
  },
  defaultOptions: [],
  create(context) {
    let isConstruct = false;
    
    return {
      ClassDeclaration(node: TSESTree.ClassDeclaration): void {
        if (node.superClass?.type === AST_NODE_TYPES.Identifier) {
          if (node.superClass.name === 'Construct') {
            isConstruct = true;
          }
          return;
        }
      },
      MethodDefinition(node: TSESTree.MethodDefinition): void {
        if(!isConstruct || !node.static || !(node.accessibility === 'public')) {
          return;
        }

        const sourceCode = context.getSourceCode();
        const name = sourceCode.getText(node.key);

        if(name === 'import') {
          context.report({
            node,
            messageId: 'staticImport',
          });
        }
      },
    }
  },
});
