import { Template } from '@aws-cdk/assertions';
import { App, Stack } from '@aws-cdk/core';
import { DemoLayer } from '../demo-layer';

test('Layer', () => {
  const app = new App();
  const stack = new Stack(app, 'TestStack');
  // WHEN
  new DemoLayer(stack, 'MyLayerConstruct');
  // THEN
  const template = Template.fromStack(stack);
  template.hasResource('AWS::Lambda::LayerVersion', {});
});
