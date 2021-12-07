import * as cdk from "aws-cdk-lib";
import { Template } from "aws-cdk-lib/assertions";
import * as HonyakutterTs from "../lib/honyakutter-ts-stack";

// example test. To run these tests, uncomment this file along with the
// example resource in lib/honyakutter-ts-stack.ts
test("Translate Lambda function Created", () => {
  const app = new cdk.App();
  const stack = new HonyakutterTs.HonyakutterTsStack(app, "StackForTest");
  const template = Template.fromStack(stack);

  template.hasResourceProperties("AWS::Lambda::Function", {
    FunctionName: "tweet-function",
    Description: "Tweet text with current time.",
    Runtime: "go1.x",
    Handler: "main",
    MemorySize: 128,
    Timeout: 60,
    Environment: {
      Variables: {
        GOTWI_API_KEY: "twitter_api_key_for_test",
        GOTWI_API_KEY_SECRET: "twitter_api_key_secret_for_test",
        GOTWI_ACCESS_TOKEN: "twitter_access_token_for_test",
        GOTWI_ACCESS_TOKEN_SECRET: "twitter_access_token_secret_for_test"
      }
    }
  });
});
