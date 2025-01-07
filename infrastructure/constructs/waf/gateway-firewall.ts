import { Construct } from 'constructs';
import { Stack } from 'aws-cdk-lib';
import { amazonIpReputationListRule, commonRule, knownBadInputsRule } from './rules/managed-rules';
import { rateBasedIpRule } from './rules/rate-based-rules';
import { LogDeliveryRole } from '../iam/log-delivery-role';
import { ServicePrincipal } from 'aws-cdk-lib/aws-iam';
import { CfnDeliveryStream } from 'aws-cdk-lib/aws-kinesisfirehose';
import { CfnLoggingConfiguration, CfnWebACL } from 'aws-cdk-lib/aws-wafv2';

interface GatewayFirewallProps {
  logBucketArn: string;
}

export class GatewayFirewall extends Construct {
  public firewallArn: string;

  constructor(scope: Construct, id: string, props: GatewayFirewallProps) {
    super(scope, id);

    const waf = new CfnWebACL(this, 'Waf', {
      description: 'Mobile Gateway WAF',
      defaultAction: { allow: {} },
      scope: 'REGIONAL',
      visibilityConfig: {
        cloudWatchMetricsEnabled: false,
        sampledRequestsEnabled: false,
        metricName: 'WAF-MobileGateway-API',
      },
      rules: [amazonIpReputationListRule(0), commonRule(1), knownBadInputsRule(2), rateBasedIpRule(3, 'General', 100)],
    });

    const accountID = Stack.of(this).account;
    const region = Stack.of(this).region;

    const deliveryRole = new LogDeliveryRole(this, 'DeliveryRole', {
      deliveryBucketArn: props.logBucketArn,
      prefix: `MobileGatewayWaf-${Stack.of(this).region}`,
      assumedBy: new ServicePrincipal('firehose.amazonaws.com'),
      objectPath: 'WAF',
    });

    const logStream = new CfnDeliveryStream(this, 'LogStream', {
      // Name has to be explicitly set to aws-waf-logs-* for WAF V2
      deliveryStreamName: 'aws-waf-logs-mobile-gateway-api',
      extendedS3DestinationConfiguration: {
        bucketArn: props.logBucketArn,
        roleArn: deliveryRole.role.roleArn,
        prefix: `AWSLogs/${accountID}/WAF/${region}/`,
        errorOutputPrefix: `AWSLogs/${accountID}/WAF/${region}/error`,
        bufferingHints: { intervalInSeconds: 120, sizeInMBs: 5 },
        compressionFormat: 'GZIP',
      },
    });

    new CfnLoggingConfiguration(this, 'LoggingConfiguration', {
      resourceArn: waf.attrArn,
      logDestinationConfigs: [logStream.attrArn],
      redactedFields: [{ singleHeader: { Name: 'Authorization' } }],
    });

    this.firewallArn = waf.attrArn;
  }
}
