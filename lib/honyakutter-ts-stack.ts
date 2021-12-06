import { Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { translateLambdaFunction, tweetLambdaFunction } from '../resources/lambda';
import { translateTweetStateMaschine } from '../resources/stepFunctions';

export class HonyakutterTsStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    console.log(process.env);
    console.log(process.env.TWITTER_API_KEY);
    console.log(process.env.TWITTER_API_KEY_SECRET);
    console.log(process.env.TWITTER_ACCESS_TOKEN);
    console.log(process.env.TWITTER_ACCESS_TOKEN_SECRET);

    // Translate Lambda function
    const translateFunc = translateLambdaFunction(this);

    // Tweet Lambda function
    const tweetFunc = tweetLambdaFunction(this);

    // State Machine
    translateTweetStateMaschine(this, translateFunc, tweetFunc)
  }
}
