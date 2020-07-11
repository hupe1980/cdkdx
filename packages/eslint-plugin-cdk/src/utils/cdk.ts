import {
  ASTUtils,
  TSESTree,
  AST_NODE_TYPES,
} from '@typescript-eslint/experimental-utils';

//const constructNames = ['Construct', 'Stack', 'Resource'];

export const hasConstructSuperClass = (
  node: TSESTree.ClassDeclaration,
  constructNames = ['Construct', 'Stack', 'Resource'],
): boolean => {
  if (!node.superClass) return false;

  switch (node.superClass.type) {
    case AST_NODE_TYPES.Identifier:
      return constructNames.includes(node.superClass.name);

    case AST_NODE_TYPES.MemberExpression:
      return (
        ASTUtils.isIdentifier(node.superClass.object) &&
        node.superClass.object.name === 'cdk' &&
        ASTUtils.isIdentifier(node.superClass.property) &&
        constructNames.includes(node.superClass.property.name)
      );

    default:
      return false;
  }
};
