import { Duration } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as iam from 'aws-cdk-lib/aws-iam';
import fs = require('fs');

const memorySize = 128;
const timeout = 60;

/**
 * Lambda function that translates text using Amazon Translate.
 * @param scope
 * @returns lambda.Function
 */
function translateLambdaFunction(scope: Construct): lambda.Function {
  const func = new lambda.Function(scope, 'TranslateLambdaFunction', {
    functionName: 'honyakutter-ts-translate-function',
    description: 'Translate text.',
    code: new lambda.AssetCode('./resources/lambdaFunctions/translate/bin/'),
    handler: 'main',
    runtime: lambda.Runtime.GO_1_X,
    memorySize: memorySize,
    timeout: Duration.seconds(timeout),
  });

  func.addToRolePolicy(new iam.PolicyStatement({
    effect: iam.Effect.ALLOW,
    actions: [
      'translate:*',
    ],
    resources: [
      '*',
    ]
  }));

  return func;
}

/**
 * Lambda function that tweet a text.
 * @param scope
 * @returns lambda.Function
 */
function tweetLambdaFunction(scope: Construct): lambda.Function {
  return new lambda.Function(scope, 'TweetLambdaFunction', {
    functionName: 'honyakutter-ts-tweet-function',
    description: 'Tweet text.',
    code: new lambda.AssetCode('./resources/lambdaFunctions/tweet/bin/'),
    handler: 'main',
    runtime: lambda.Runtime.GO_1_X,
    memorySize: memorySize,
    timeout: Duration.seconds(timeout),
    environment: {
      'GOTWI_API_KEY':             process.env.TWITTER_API_KEY!,
			'GOTWI_API_KEY_SECRET':      process.env.TWITTER_API_KEY_SECRET!,
			'GOTWI_ACCESS_TOKEN':        process.env.TWITTER_ACCESS_TOKEN!,
			'GOTWI_ACCESS_TOKEN_SECRET': process.env.TWITTER_ACCESS_TOKEN_SECRET!,
    }
  });
}

export {
  translateLambdaFunction,
  tweetLambdaFunction,
}