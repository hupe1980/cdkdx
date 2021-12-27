import { expect as expectCDK, haveResource } from '@aws-cdk/assert';
import { App } from '@aws-cdk/core';
import { ReactStack } from '../react-stack';

test('SSR Stack', () => {
  // GIVEN
  const app = new App();

  // WHEN
  const stack = new ReactStack(app, 'ReactStack');

  // THEN
  expectCDK(stack).to(haveResource('AWS::Lambda::Function'));
  expectCDK(stack).to(haveResource('AWS::ApiGateway::Resource'));
});
