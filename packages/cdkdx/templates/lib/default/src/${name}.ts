import * as path from 'path';
import { Code, Function, Runtime } from 'aws-cdk-lib/aws-lambda';
import { Construct } from 'constructs';

export interface ${pascalCase(name)}Props {
  readonly environment?: Record<string, string>;
}

export class ${pascalCase(name)} extends Construct {
  constructor(scope: Construct, id: string, props: ${pascalCase(name)}Props = {}) {
    super(scope, id);

    new Function(this, 'DemoFunction', {
      runtime: Runtime.NODEJS_12_X,
      handler: 'index.handler',
      code: Code.fromAsset(path.join(__dirname, 'lambdas', 'demo')),
      environment: props.environment,
    });
  }
}
