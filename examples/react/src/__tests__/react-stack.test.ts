import { Template } from '@aws-cdk/assertions';
import { App } from '@aws-cdk/core';
import { ReactStack } from '../react-stack';

test('SSR Stack', () => {
  // GIVEN
  const app = new App();

  // WHEN
  const stack = new ReactStack(app, 'ReactStack');

  // THEN
  const template = Template.fromStack(stack as any);
  template.hasResource('AWS::Lambda::Function', {});
  template.hasResource('AWS::ApiGateway::Resource', {});
});
