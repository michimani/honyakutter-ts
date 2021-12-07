import { Stack, StackProps } from "aws-cdk-lib";
import { Construct } from "constructs";
import { tweetLambdaFunction } from "../resources/lambda";
import { translateTweetStateMaschine } from "../resources/stepFunctions";

export class HonyakutterTsStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    // Tweet Lambda function
    const tweetFunc = tweetLambdaFunction(this);

    // State Machine
    translateTweetStateMaschine(this, tweetFunc);
  }
}
