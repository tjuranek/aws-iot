#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { PrintsterStack } from '../lib/printster-stack';
import 'dotenv/config';

const app = new cdk.App();

new PrintsterStack(app, 'PrintsterStack', {
  env: {
    account: process.env.AWS_ACCOUNT_NUMBER,
    region: process.env.AWS_DEFAULT_REGION
  }
});