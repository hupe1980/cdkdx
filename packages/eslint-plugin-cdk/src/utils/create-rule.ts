import { ESLintUtils } from '@typescript-eslint/experimental-utils';

export const createRule = ESLintUtils.RuleCreator(
  name =>
    `https://github.com/hupe1980/cdkdx/tree/master/packages/eslint-plugin-cdk/docs/rules/${name}.md`,
);