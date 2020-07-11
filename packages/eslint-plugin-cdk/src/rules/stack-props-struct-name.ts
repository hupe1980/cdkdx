import {
  TSESTree,
  AST_NODE_TYPES,
} from '@typescript-eslint/experimental-utils';
import { createRule, hasConstructSuperClass } from '../utils';

export default createRule({
  name: 'construct-props-struct-name',
  meta: {
    docs: {
      description: 'Ensure a uniform stack constructors signature',
      category: 'Best Practices',
      recommended: 'error',
    },
    messages: {
      stackPropsStructNname: 'All stack must have a props struct',
    },
    schema: [],
    type: 'suggestion',
  },
  defaultOptions: [],
  create(context) {
    const sourceCode = context.getSourceCode();

    let isStack = false;
    let className: string | undefined;

    const getIdentifier = (node: TSESTree.Parameter) =>
      node.type === AST_NODE_TYPES.AssignmentPattern ? node.left : node;

    return {
      'ClassDeclaration[superClass]'(node: TSESTree.ClassDeclaration): void {
        isStack = hasConstructSuperClass(node, ['Stack']);
        className = node.id?.name;
      },
      'MethodDefinition[key.name = "constructor"]'(
        node: TSESTree.MethodDefinition,
      ): void {
        if (!isStack || node.value.params.length < 3) {
          return;
        }

        const identifier = getIdentifier(node.value.params[2]);

        const type = sourceCode.getLastToken(identifier)?.value;

        if (type !== `${className}Props` && type !== 'StackProps') {
          context.report({
            node: identifier,
            messageId: 'stackPropsStructNname',
          });
        }
      },
    };
  },
});
