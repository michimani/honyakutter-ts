import { Duration } from "aws-cdk-lib";
import { Construct } from "constructs";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as stepfunctions from "aws-cdk-lib/aws-stepfunctions";
import * as tasks from "aws-cdk-lib/aws-stepfunctions-tasks";
import { StateMachineLogGroup } from "./logs";

const stateMachineTimeout = 300;
const taskTimeout = 60;

function translateTweetStateMaschine(
  scope: Construct,
  tweetFunc: lambda.Function
) {
  const initState = new stepfunctions.Pass(scope, "init", {
    comment: "init state"
  });

  // Translate state
  const translateResultSelector: { [key: string]: string } = {
    "inputText.$": "$.TranslatedText"
  };
  const callAWSServiceProps: tasks.CallAwsServiceProps = {
    service: "Translate",
    action: "translateText",
    iamResources: ["*"],
    iamAction: "translate:TranslateText",
    parameters: {
      SourceLanguageCode: stepfunctions.JsonPath.stringAt("$.sourceLang"),
      TargetLanguageCode: stepfunctions.JsonPath.stringAt("$.targetLang"),
      Text: stepfunctions.JsonPath.stringAt("$.inputText")
    },
    resultSelector: translateResultSelector
  };
  const translateState = new tasks.CallAwsService(
    scope,
    "TranslateByAmazonTranslate",
    callAWSServiceProps
  );

  // Tweet state
  const tweetState = lambdaFunctionToTask(scope, tweetFunc, {});

  const definition = initState.next(translateState).next(tweetState);

  const logGroup = StateMachineLogGroup(
    scope,
    "TranslateTweetStateMachineLogGroup"
  );
  new stepfunctions.StateMachine(scope, "TranslateTweetStateMaschine", {
    stateMachineName: "honyakutter-ts-translate-tweet-state-maschine",
    stateMachineType: stepfunctions.StateMachineType.EXPRESS,
    timeout: Duration.seconds(stateMachineTimeout),
    definition: definition,
    logs: {
      destination: logGroup,
      level: stepfunctions.LogLevel.ALL
    }
  });
}

function lambdaFunctionToTask(
  scope: Construct,
  func: lambda.Function,
  resultSelector: { [key: string]: string }
): tasks.LambdaInvoke {
  const props: tasks.LambdaInvokeProps = {
    lambdaFunction: func,
    invocationType: tasks.LambdaInvocationType.REQUEST_RESPONSE,
    timeout: Duration.seconds(taskTimeout),
    resultSelector: resultSelector
  };

  return new tasks.LambdaInvoke(scope, func.functionName, props);
}

export { translateTweetStateMaschine };
