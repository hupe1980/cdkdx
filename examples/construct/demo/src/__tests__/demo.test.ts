import { expect as expectCDK, haveResource } from '@aws-cdk/assert';
import { Stack } from '@aws-cdk/core';
import { Demo } from '../demo';

test('default setup', () => {
  // GIVEN
  const stack = new Stack();
  
  // WHEN
  new Demo(stack, 'Demo');
  
  // THEN
  expectCDK(stack).to(haveResource('AWS::Lambda::Function'));
});
