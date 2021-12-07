import { Construct } from "constructs";
import * as logs from "aws-cdk-lib/aws-logs";

function StateMachineLogGroup(
  scope: Construct,
  groupName: string
): logs.LogGroup {
  return new logs.LogGroup(scope, groupName);
}

export { StateMachineLogGroup };
