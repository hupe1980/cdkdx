import { TsConfig } from '../src/ts-config';

test('default jsii-template', () => {
  const tsConfig = TsConfig.fromJsiiTemplate();
  expect(tsConfig.getCompilerOptions()).toMatchSnapshot();
});

test('default lambda-template', () => {
  const tsConfig = TsConfig.fromLambdaTemplate();
  expect(tsConfig.getCompilerOptions()).toMatchSnapshot();
});
