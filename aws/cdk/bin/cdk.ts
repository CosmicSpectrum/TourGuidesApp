#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { s3BucketStack } from '../lib/bucket_stack';

const app = new cdk.App();
new s3BucketStack(app, 's3BucketStack');
app.synth();
