import { expect as expectCDK, haveResource } from '@aws-cdk/assert';
import { App, Stack } from '@aws-cdk/core';
import { ${pascalCase(name)} } from '../${name}';

test('default setup', () => {
  // GIVEN
  const app = new App();
  
  const stack = new Stack(app, 'TestStack');
  
  // WHEN
  new ${pascalCase(name)}(stack, '${pascalCase(name)}');
  
  // THEN
  expectCDK(stack).to(haveResource('AWS::Lambda::Function'));
});