import { expect as expectCDK, haveResource } from '@aws-cdk/assert';
import { App, Stack } from '@aws-cdk/core';
import { DemoLayer } from '../demo-layer';

test('Layer', () => {
  const app = new App();
  const stack = new Stack(app, 'TestStack');
  // WHEN
  new DemoLayer(stack, 'MyLayerConstruct');
  // THEN
  expectCDK(stack).to(haveResource('AWS::Lambda::LayerVersion'));
});
