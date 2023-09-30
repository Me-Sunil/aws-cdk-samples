#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { LambdaSqsEventStack } from '../lib/lambda-sqs-event-stack';

const app = new cdk.App();
new LambdaSqsEventStack(app, 'LambdaSqsEventStack', {
  env: { 
    account: process.env.CDK_DEFAULT_ACCOUNT, 
    region: process.env.CDK_DEFAULT_REGION 
  },
  tags : {
    'Name' : 'Sample-CDK-Application',
  }
});