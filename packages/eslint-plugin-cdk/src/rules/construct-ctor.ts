import {
  AST_NODE_TYPES, ASTUtils, TSESTree,
} from '@typescript-eslint/experimental-utils';
import { createRule } from '../utils';

export default createRule({
  name: 'construct-ctor',
  meta: {
    docs: {
      description: 'Ensure a uniform construct constructors signature',
      category: 'Best Practices',
      recommended: 'error',
    },
    messages: {
      constructCtor: 'Signature of all construct constructors should be "scope, id, props"',
    },
    schema: [],
    type: 'problem',
  },
  defaultOptions: [],
  create(context) {
    const constructorParamNames = ['scope', 'id', 'props'];
    
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
        if (!isConstruct || !ASTUtils.isConstructor(node)) {
          return;
        }
        
        node.value.params.forEach((param, index) => {          
          if (ASTUtils.isIdentifier(param)) {
            if (param.name !== constructorParamNames[index]) {
              context.report({
                node: param,
                messageId: 'constructCtor',
              });
              return;
            }
          }
        });
      },
    }
  },
});
