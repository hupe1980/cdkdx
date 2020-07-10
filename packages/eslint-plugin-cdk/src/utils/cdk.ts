import {
  ASTUtils,
  TSESTree,
  AST_NODE_TYPES,
} from '@typescript-eslint/experimental-utils';

export const hasConstructSuperClass = (
  node: TSESTree.ClassDeclaration,
): boolean => {
  if (!node.superClass) return false;

  switch (node.superClass.type) {
    case AST_NODE_TYPES.Identifier:
      return node.superClass.name === 'Construct';

    case AST_NODE_TYPES.MemberExpression:
      return (
        ASTUtils.isIdentifier(node.superClass.object) &&
        node.superClass.object.name === 'cdk' &&
        ASTUtils.isIdentifier(node.superClass.property) &&
        node.superClass.property.name === 'Construct'
      );

    default:
      return false;
  }
};
