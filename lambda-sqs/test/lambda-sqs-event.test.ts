import * as cdk from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';
import * as LambdaSqsEvent from '../lib/lambda-sqs-event-stack';

test('SQS Queue Created', () => {
    const app = new cdk.App();
    const stack = new LambdaSqsEvent.LambdaSqsEventStack(app, 'MyTestStack');
    const template = Template.fromStack(stack);

    template.hasResourceProperties('AWS::Lambda::Function', {
        Runtime: "nodejs18.x",
        TracingConfig: { "Mode": "Active" },
        Timeout: 120,
        Handler: "operation.handler",
    });

    template.hasResourceProperties('AWS::SQS::Queue', {
        VisibilityTimeout: 300
    });
});
