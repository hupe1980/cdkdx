import { expect as expectCDK, matchTemplate, MatchStyle } from '@aws-cdk/assert';
import { App } from '@aws-cdk/core';
import { ${pascalCase(name)}Stack } from '../${name}-stack';

test('Empty Stack', () => {
  // GIVEN
  const app = new App();

  // WHEN
  const stack = new ${pascalCase(name)}Stack(app, '${pascalCase(name)}Stack');

  // THEN
  expectCDK(stack).to(matchTemplate({ 'Resources': {} }, MatchStyle.EXACT))
});
