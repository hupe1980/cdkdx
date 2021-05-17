import { expect as expectCDK, haveResource } from '@aws-cdk/assert';
import { App, Stack } from '@aws-cdk/core';
import { Example } from '../example';

test('SQS Queue Created', () => {
  const app = new App();
  const stack = new Stack(app, 'TestStack');
  // WHEN
  new Example(stack, 'MyTestConstruct');
  // THEN
  expectCDK(stack).to(haveResource('AWS::SQS::Queue'));
});

test('SNS Topic Created!', () => {
  const app = new App();
  const stack = new Stack(app, 'TestStack');
  // WHEN
  new Example(stack, 'MyTestConstruct');
  // THEN
  expectCDK(stack).to(haveResource('AWS::SNS::Topic'));
});
