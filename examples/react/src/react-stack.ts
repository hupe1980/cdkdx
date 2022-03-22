import * as path from 'path';
import { LambdaRestApi } from 'aws-cdk-lib/aws-apigateway';
import { Code, Function, Runtime } from 'aws-cdk-lib/aws-lambda';
import { Stack, StackProps } from 'aws-cdk-lib/core';
import { Construct } from 'constructs';

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
