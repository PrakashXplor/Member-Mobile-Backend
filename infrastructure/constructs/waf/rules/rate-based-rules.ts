import { RuleAction } from './rule-action';
import { CfnWebACL } from 'aws-cdk-lib/aws-wafv2';
import RuleProperty = CfnWebACL.RuleProperty;
import RateBasedStatementProperty = CfnWebACL.RateBasedStatementProperty;

interface RateBasedRule extends RuleProperty {
  statement: {
    rateBasedStatement: RateBasedStatementProperty;
  };
}

/** Generates a rate based rule for IP rate limiting. Applies {limit} requests within a 5-minute period */
export const rateBasedIpRule = (priority: number, prefix: string, limit: number, overrideAction: RuleAction = 'block'): RateBasedRule => ({
  priority: priority,
  action: { [overrideAction]: {} },
  visibilityConfig: {
    sampledRequestsEnabled: false,
    cloudWatchMetricsEnabled: false,
    metricName: `${prefix}-RateBasedRule`,
  },
  name: `${prefix}-RateBasedRule`,
  statement: {
    rateBasedStatement: {
      limit: limit,
      aggregateKeyType: 'IP',
    },
  },
});
