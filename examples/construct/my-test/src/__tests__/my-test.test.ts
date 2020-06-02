import { expect as expectCDK, haveResource } from '@aws-cdk/assert';
import { App, Stack } from '@aws-cdk/core';
import { MyTest } from '../my-test';

test('default setup', () => {
  // GIVEN
  const app = new App();
  const stack = new Stack(app, "TestStack");
  
  // WHEN
  new MyTest(stack, 'MyTest');
  
  // THEN
  expectCDK(stack).to(haveResource("AWS::LAMBDA::Function"));
});