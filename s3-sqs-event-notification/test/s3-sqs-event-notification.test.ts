import * as cdk from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';
import * as S3SqsEventNotification from '../lib/s3-sqs-event-notification-stack';

test('S3 Queue Created', () => {
    const app = new cdk.App();
    const stack = new S3SqsEventNotification.S3SqsEventNotificationStack(app, 'MyTestStack');
    const template = Template.fromStack(stack);

    template.hasResourceProperties('AWS::S3::Bucket', {
        BucketEncryption: {
            "ServerSideEncryptionConfiguration": [
                { "ServerSideEncryptionByDefault": { "SSEAlgorithm": "AES256" } }
            ]
        }
    });

    template.hasResourceProperties('AWS::SQS::Queue', {
        VisibilityTimeout: 300,
    });
});
