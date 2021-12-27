import * as path from 'path';
import { LambdaRestApi } from '@aws-cdk/aws-apigateway';
import { Code, Function, Runtime } from '@aws-cdk/aws-lambda';
import { Construct, Stack, StackProps } from '@aws-cdk/core';

export class ReactStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const ssrFunction = new Function(this, 'Test1Function', {
      runtime: Runtime.NODEJS_12_X,
      handler: 'index.handler',
      code: Code.fromAsset(path.join(process.env.LAMBDAS as string, 'web')),
    });

    new LambdaRestApi(this, 'SSREndpoint', {
      handler: ssrFunction,
    });
  }
}
