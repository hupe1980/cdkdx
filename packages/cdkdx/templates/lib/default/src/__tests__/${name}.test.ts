import { expect as expectCDK, haveResource } from '@aws-cdk/assert';
import { Stack } from '@aws-cdk/core';
import { ${pascalCase(name)} } from '../${name}';

test('default setup', () => {
  // GIVEN
  const stack = new Stack();
  
  // WHEN
  new ${pascalCase(name)}(stack, '${pascalCase(name)}');
  
  // THEN
  expectCDK(stack).to(haveResource('AWS::Lambda::Function'));
});