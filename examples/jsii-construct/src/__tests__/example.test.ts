import { Template } from '@aws-cdk/assertions';
import { App, Stack } from '@aws-cdk/core';
import { Example } from '../index';

test('SQS Queue Created', () => {
  const app = new App();
  const stack = new Stack(app, 'TestStack');
  // WHEN
  new Example(stack, 'MyTestConstruct');
  // THEN
  const template = Template.fromStack(stack);
  template.hasResource('AWS::SQS::Queue', {});
});

test('SNS Topic Created', () => {
  const app = new App();
  const stack = new Stack(app, 'TestStack');
  // WHEN
  new Example(stack, 'MyTestConstruct');
  // THEN
  const template = Template.fromStack(stack);
  template.hasResource('AWS::SNS::Topic', {});
});
