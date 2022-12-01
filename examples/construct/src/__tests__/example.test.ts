import { Template } from '@aws-cdk/assertions';
import { Stack } from '@aws-cdk/core';
import { Example } from '../example';

test('SQS Queue Created', () => {
  const stack = new Stack();
  // WHEN
  new Example(stack, 'MyTestConstruct');
  // THEN
  const template = Template.fromStack(stack);
  template.hasResource('AWS::SQS::Queue', {});
});

test('SNS Topic Created!', () => {
  const stack = new Stack();
  // WHEN
  new Example(stack, 'MyTestConstruct');
  // THEN
  const template = Template.fromStack(stack);
  template.hasResource('AWS::SNS::Topic', {});
});
