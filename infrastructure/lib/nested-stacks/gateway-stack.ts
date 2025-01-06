import { Construct } from 'constructs';
import { NestedStack, NestedStackProps, Stack } from 'aws-cdk-lib';
import { EnvironmentContext } from '../../../src/utils/validate-environment-context';
import { GatewayFirewall } from '../../constructs/waf/gateway-firewall';
import { ImportedResourcesStack } from './imported-resources-stack';
import { AccessLogFormat, FirehoseLogDestination, IntegrationResponse, RequestValidator, RestApi, LambdaIntegration } from 'aws-cdk-lib/aws-apigateway';
import { CfnWebACLAssociation } from 'aws-cdk-lib/aws-wafv2';
import { CfnDeliveryStream } from 'aws-cdk-lib/aws-kinesisfirehose';
import { LogDeliveryRole } from '../../constructs/iam/log-delivery-role';
import { ServicePrincipal } from 'aws-cdk-lib/aws-iam';
import { AuthenticationRoute } from '../../../src/routes/authentication-route';

interface GatewayStackProps extends NestedStackProps {
  environmentContext: EnvironmentContext;
  importedResourcesStack: ImportedResourcesStack;
}

export class GatewayStack extends NestedStack {
  constructor(scope: Construct, id: string, props: GatewayStackProps) {
    super(scope, id, props);

    const firewall = new GatewayFirewall(this, 'Firewall', {
      logBucketArn: props.importedResourcesStack.logBucket.bucketArn,
    });

    const gateway = new RestApi(this, 'ApiGateway', {
      description: 'Mobile Gateway POC',
      deploy: true,
      deployOptions: {
        tracingEnabled: true,
        throttlingRateLimit: 5,
        throttlingBurstLimit: 5,
        accessLogDestination: new FirehoseLogDestination(
          new CfnDeliveryStream(this, 'AccessLogDeliveryStream', {
            deliveryStreamName: 'amazon-apigateway-poc-access-logs',
            extendedS3DestinationConfiguration: {
              bucketArn: props.importedResourcesStack.logBucket.bucketArn,
              roleArn: new LogDeliveryRole(this, 'AccessLogDeliveryRole', {
                assumedBy: new ServicePrincipal('firehose.amazonaws.com'),
                deliveryBucketArn: props.importedResourcesStack.logBucket.bucketArn,
                objectPath: 'APIGateway',
                prefix: 'AccessLog',
              }).role.roleArn,
              prefix: `AWSLogs/${Stack.of(this).account}/WAF/${Stack.of(this).region}/`,
              errorOutputPrefix: `AWSLogs/${Stack.of(this).account}/WAF/${Stack.of(this).region}/error`,
              bufferingHints: { intervalInSeconds: 120, sizeInMBs: 5 },
              compressionFormat: 'GZIP',
            },
          }),
        ),
        accessLogFormat: AccessLogFormat.jsonWithStandardFields({
          caller: false,
          requestTime: true,
          ip: true,
          protocol: true,
          httpMethod: true,
          resourcePath: true,
          user: true,
          status: true,
          responseLength: true,
        }),
      },
    });

    const requestValidator = new RequestValidator(this, 'RequestValidator', {
      restApi: gateway,
      validateRequestBody: true,
      validateRequestParameters: true,
    });

    const defaultIntegrationResponses: IntegrationResponse[] = [
      {
        statusCode: '401',
        selectionPattern: '401',
        responseTemplates: {
          'application/json': 'unauthorised',
        },
      },
    ];

    new AuthenticationRoute(this, 'AuthenticationRoute', {
      environmentContext: props.environmentContext,
      gateway: gateway,
      defaultIntegrationResponses: defaultIntegrationResponses,
      requestValidator: requestValidator,
    });

    // Add a simple "Hello" route
    // const helloLambda = new Function(this, 'HelloLambda', {
    //   runtime: Runtime.NODEJS_18_X,
    //   handler: 'hello.handler',
    //   code: Code.fromInline(`
    //     exports.handler = async () => {
    //       return {
    //         statusCode: 200,
    //         body: JSON.stringify({ message: "Hello" }),
    //       };
    //     };
    //   `),
    // });

    // const helloIntegration = new LambdaIntegration(helloLambda);
    // const helloResource = gateway.root.addResource('hello');
    // helloResource.addMethod('GET', helloIntegration);

    new CfnWebACLAssociation(this, 'FirewallAssociation', {
      resourceArn: gateway.deploymentStage.stageArn,
      webAclArn: firewall.firewallArn,
    });
  }
}
