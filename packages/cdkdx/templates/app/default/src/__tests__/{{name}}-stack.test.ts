import { expect as expectCDK } from '@aws-cdk/assert';
import { App } from '@aws-cdk/core';
import { {{name | pascalCase}}Stack } from '../{{name}}-stack';

test('Empty Stack', () => {
  // GIVEN
  const app = new App();
  
  // WHEN
  const stack = new {{name | pascalCase}}Stack(app, '{{name | pascalCase}}Stack');
  
  
  // THEN
   expectCDK(stack).to(matchTemplate({
      "Resources": {}
    }, MatchStyle.EXACT))
});