import { Duration } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as stepfunctions from 'aws-cdk-lib/aws-stepfunctions';
import * as tasks from 'aws-cdk-lib/aws-stepfunctions-tasks';
import fs = require('fs');

const stateMachineTimeout = 300;
const taskTimeout = 60;

interface resultSelectorItem {
  key: string;
  value: string;
}

function translateTweetStateMaschine(scope: Construct, translateFunc: lambda.Function, tweetFunc: lambda.Function) {
  const initState = new stepfunctions.Pass(scope, 'init', {
    comment: 'init state'
  });

  // Translate state
  const translateResultSelector: resultSelectorItem[] = [
    {key: 'inputText.$', value: '$.Payload'},
  ];
  const translateState = lambdaFunctionToTask(scope, translateFunc, translateResultSelector)

  // Tweet state
  const tweetState = lambdaFunctionToTask(scope, tweetFunc, [])

  const definition = initState.next(translateState).next(tweetState);

  new stepfunctions.StateMachine(scope, 'TranslateTweetStateMaschine', {
    stateMachineName: 'honyakutter-ts-translate-tweet-state-maschine',
    stateMachineType: stepfunctions.StateMachineType.EXPRESS,
    timeout: Duration.seconds(stateMachineTimeout),
    definition: definition,
  });
}

function lambdaFunctionToTask(scope: Construct, func: lambda.Function, resultSelectorItems: resultSelectorItem[]): tasks.LambdaInvoke {
  const resultSelector = new Map<string, string>();
  resultSelectorItems.forEach((item) => {
    resultSelector.set(item.key, item.value);
  });

  const props: tasks.LambdaInvokeProps = {
    lambdaFunction: func,
    invocationType: tasks.LambdaInvocationType.REQUEST_RESPONSE,
    timeout: Duration.seconds(taskTimeout),
    resultSelector: resultSelector,
  }

  return new tasks.LambdaInvoke(scope, func.functionName, props);
}

export { translateTweetStateMaschine };