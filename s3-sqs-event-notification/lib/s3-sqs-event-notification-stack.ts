import * as cdk from 'aws-cdk-lib';
import { IBucket } from 'aws-cdk-lib/aws-s3';
import { SqsDestination } from 'aws-cdk-lib/aws-s3-notifications';
import { IQueue } from 'aws-cdk-lib/aws-sqs';
import { Construct } from 'constructs';

/**
 * Create Stack, to create S3 and Queue with Event Notification
 *
 * @export
 * @class S3SqsEventNotificationStack
 * @extends {cdk.Stack}
 */
export class S3SqsEventNotificationStack extends cdk.Stack {

  // Prefix to S3 Bucket, to be used to trigger s3 event.
  readonly prefix_s3_file = 'aws-sample'

  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const s3Bucket = this.createS3Bucket()
    const sqsQueue = this.createEventQueue()

    s3Bucket.addObjectCreatedNotification(new SqsDestination(sqsQueue), {
      prefix: this.prefix_s3_file
    });
  }

  /**
   * Create S3 Bucket
   * @return {*}  {IBucket}
   * @memberof S3SqsEventNotificationStack
   */
  createS3Bucket() : IBucket{
    return new cdk.aws_s3.Bucket(this, 's3Bucket', {
      encryption : cdk.aws_s3.BucketEncryption.S3_MANAGED
    })
  }

  /**
   * Creating Queue, which will be use to consume event from S3
   *
   * @return {*}  {IQueue}
   * @memberof S3SqsEventNotificationStack
   */
  createEventQueue(): IQueue {
    return new cdk.aws_sqs.Queue(this, 'SqsQueue', {
      visibilityTimeout: cdk.Duration.seconds(300)
    });
  }
}