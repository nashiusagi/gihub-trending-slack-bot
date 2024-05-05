import * as cdk from "aws-cdk-lib";
import type { Construct } from "constructs";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as apigw from "aws-cdk-lib/aws-apigateway";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import { Rule, Schedule } from "aws-cdk-lib/aws-events";
import { LambdaFunction } from "aws-cdk-lib/aws-events-targets";

export class LambdaGithubTrendsBotStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const fn = new NodejsFunction(this, "lambda", {
      entry: "lambda/index.ts",
      handler: "handler",
      runtime: lambda.Runtime.NODEJS_20_X,
    });
    fn.addFunctionUrl({
      authType: lambda.FunctionUrlAuthType.NONE,
    });
    new apigw.LambdaRestApi(this, "myapi", {
      handler: fn,
    });

    // Eventbridge rules
    new Rule(this, "schedule-cron-github-trends", {
      schedule: Schedule.cron({ minute: "0", hour: "0" }),
      targets: [new LambdaFunction(fn)],
    });
  }
}
