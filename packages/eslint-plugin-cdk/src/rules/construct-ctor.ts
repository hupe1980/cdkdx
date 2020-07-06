import {
  AST_NODE_TYPES, ASTUtils,
} from '@typescript-eslint/experimental-utils';
import { createRule } from '../utils';

export default createRule({
  name: 'construct-ctor',
  meta: {
    docs: {
      description: 'Ensure a uniform construct constructors signature',
      category: 'Best Practices',
      recommended: 'error',
      requiresTypeChecking: false,
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
      ClassDeclaration(node): void {
        if (node.superClass?.type === AST_NODE_TYPES.Identifier) {
          if (node.superClass.name === 'Construct') {
            isConstruct = true;
          }
          return;
        }
      },
      MethodDefinition(node): void {
        if (!isConstruct || !ASTUtils.isConstructor(node)) {
          return;
        }

        let hasFailure = false;
        
        node.value.params.forEach((param, index) => {          
          if (ASTUtils.isIdentifier(param)) {
            if (param.name !== constructorParamNames[index]) {
              hasFailure = true;
            }
          }
        });

        if(hasFailure) {
          context.report({
            node,
            messageId: 'constructCtor',
          });
        }
      },
    }
  },
});
