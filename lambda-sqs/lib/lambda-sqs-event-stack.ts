import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as path from 'path';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as logs from 'aws-cdk-lib/aws-logs';
import { SqsEventSource } from 'aws-cdk-lib/aws-lambda-event-sources';

/**
 * Stack, to Provision Lambda and SQS
 * Attach SQS to Send Event to Lambda
 *
 * @export
 * @class LambdaSqsEventStack
 * @extends {cdk.Stack}
 */
export class LambdaSqsEventStack extends cdk.Stack {

  /**
   * Creates an instance of LambdaSqsEventStack.
   * @param {Construct} scope
   * @param {string} id
   * @param {cdk.StackProps} [props]
   * @memberof LambdaSqsEventStack
   */
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Creating Lambda Function
    let lambdaFunction = this.createOperationalLambdaFunction()

    // Creating SQS Queue
    let eventQueue = this.createEventQueue()

    // Granting SQS Queue Consume Permission to Lambda
    eventQueue.grantConsumeMessages(lambdaFunction)

    // Adding SQS as EventSource to Lambda
    lambdaFunction.addEventSource(new SqsEventSource(eventQueue, {
      batchSize: 1,
      enabled: true,
      maxConcurrency: 5,
    }));
  }

  /**
   * Operational Lambda, that serves the request
   *
   * @return {*}  {cdk.aws_lambda.IFunction}
   * @memberof LambdaSqsEventStack
   */
  createOperationalLambdaFunction(): cdk.aws_lambda.IFunction {
    return new cdk.aws_lambda_nodejs.NodejsFunction(this, 'operational-lambda', {
      bundling: {
        sourceMap: true,
        minify: true,
      },
      description: 'Operational Lambda',
      entry: path.join(__dirname, `./lambda/operation.ts`),
      environment: {
        NODE_OPTIONS: '--enable-source-maps',
      },
      handler: 'operation.handler',
      logRetention: logs.RetentionDays.ONE_DAY,
      memorySize: 512,
      runtime: lambda.Runtime.NODEJS_18_X,
      timeout: cdk.Duration.minutes(2),
      tracing: lambda.Tracing.ACTIVE,
    })
  }

  /**
   * Creating Queue, which will be use to send event to Lambda
   *
   * @return {*}  {cdk.aws_sqs.IQueue}
   * @memberof LambdaSqsEventStack
   */
  createEventQueue(): cdk.aws_sqs.IQueue {
    return new cdk.aws_sqs.Queue(this, 'LambdaSqsEventQueue', {
      visibilityTimeout: cdk.Duration.seconds(300)
    });
  }

}
