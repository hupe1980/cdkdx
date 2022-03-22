import * as path from 'path';
import { Code, Function, Runtime } from 'aws-cdk-lib/aws-lambda';
import * as sns from 'aws-cdk-lib/aws-sns';
import * as subs from 'aws-cdk-lib/aws-sns-subscriptions';
import * as sqs from 'aws-cdk-lib/aws-sqs';
import * as cdk from 'aws-cdk-lib/core';
import { Construct } from 'constructs';

export interface ExampleProps {
  /**
   * The visibility timeout to be configured on the SQS Queue, in seconds.
   *
   * @default Duration.seconds(300)
   */
  readonly visibilityTimeout?: cdk.Duration;
}

export class Example extends Construct {
  /** @returns the ARN of the SQS queue */
  public readonly queueArn: string;

  constructor(scope: Construct, id: string, props: ExampleProps = {}) {
    super(scope, id);

    const queue = new sqs.Queue(this, 'ExampleQueue', {
      visibilityTimeout: props.visibilityTimeout || cdk.Duration.seconds(300),
    });

    const topic = new sns.Topic(this, 'ExampleTopic');

    topic.addSubscription(new subs.SqsSubscription(queue));

    this.queueArn = queue.queueArn;

    new Function(this, 'Test1Function', {
      runtime: Runtime.NODEJS_12_X,
      handler: 'index.handler',
      code: Code.fromAsset(path.join(__dirname, 'lambdas', 'test1')),
    });

    new Function(this, 'Test2Function', {
      runtime: Runtime.NODEJS_12_X,
      handler: 'index.handler',
      code: Code.fromAsset(path.join(__dirname, 'lambdas', 'test2')),
    });
  }
}
