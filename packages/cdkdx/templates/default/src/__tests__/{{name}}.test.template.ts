import { expect as expectCDK, haveResource } from '@aws-cdk/assert';
import { App, Stack } from '@aws-cdk/core';
import { {{name | pascalCase}} } from '../{{name}}';

test('default setup', () => {
  // GIVEN
  const app = new App();
  
  const stack = new Stack(app, 'TestStack');
  
  // WHEN
  new {{name | pascalCase}}(stack, '{{name | pascalCase}}');
  
  // THEN
  expectCDK(stack).to(haveResource('AWS::LAMBDA::Function'));
});