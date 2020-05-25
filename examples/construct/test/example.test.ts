import { expect as expectCDK, haveResource, SynthUtils } from '@aws-cdk/assert';
import cdk = require('@aws-cdk/core');
import Example = require('../src/index');

test('SQS Queue Created', () => {
  const app = new cdk.App();
  const stack = new cdk.Stack(app, 'TestStack');
  // WHEN
  new Example.Example(stack, 'MyTestConstruct');
  // THEN
  expectCDK(stack).to(haveResource('AWS::SQS::Queue'));
});

test('SNS Topic Created', () => {
  const app = new cdk.App();
  const stack = new cdk.Stack(app, 'TestStack');
  // WHEN
  new Example.Example(stack, 'MyTestConstruct');
  // THEN
  expectCDK(stack).to(haveResource('AWS::SNS::Topic'));
});