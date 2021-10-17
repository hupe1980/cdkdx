import { expect as expectCDK, matchTemplate, MatchStyle } from '@aws-cdk/assert';
import { App } from '@aws-cdk/core';
import { AppStack } from '../app-stack';

test('Empty Stack', () => {
  // GIVEN
  const app = new App();

  // WHEN
  const stack = new AppStack(app, 'AppStack');

  // THEN
  expectCDK(stack).to(matchTemplate({ Resources: {} }, MatchStyle.EXACT));
});
