import { TSESTree } from '@typescript-eslint/experimental-utils';
import { createRule } from '../utils';

const UPPER_SNAKE_CASE_ALLOWED_PATTERN = new RegExp(
  '^[A-Z0-9][A-Z0-9_]*[A-Z0-9]+$',
);

export default createRule({
  name: 'public-static-property-all-caps',
  meta: {
    docs: {
      description:
        'Enforces all static properties must be named using ALL_CAPS',
      recommended: 'error',
    },
    messages: {
      allCaps: 'Public static properties must be named using ALL_CAPS',
    },
    schema: [],
    type: 'problem',
  },
  defaultOptions: [],
  create(context) {
    return {
      PropertyDefinition(node: TSESTree.PropertyDefinition): void {
        if (
          !node.static ||
          !node.readonly ||
          !(node.accessibility === 'public')
        ) {
          return;
        }

        const sourceCode = context.getSourceCode();
        const name = sourceCode.getText(node.key);

        if (!UPPER_SNAKE_CASE_ALLOWED_PATTERN.test(name)) {
          context.report({
            node,
            messageId: 'allCaps',
          });
        }
      },
    };
  },
});
