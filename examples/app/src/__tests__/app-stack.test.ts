import { Template } from '@aws-cdk/assertions';
import { App } from '@aws-cdk/core';
import { AppStack } from '../app-stack';

test('Empty Stack', () => {
  // GIVEN
  const app = new App();

  // WHEN
  const stack = new AppStack(app, 'AppStack');

  // THEN
  const template = Template.fromStack(stack);
  template.templateMatches({});
});
