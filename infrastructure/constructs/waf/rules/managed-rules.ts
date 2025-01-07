import { CfnWebACL } from 'aws-cdk-lib/aws-wafv2';
import RuleProperty = CfnWebACL.RuleProperty;
import ExcludedRuleProperty = CfnWebACL.ExcludedRuleProperty;
import { RuleAction } from './rule-action';

export const amazonIpReputationListRule = (
  priority: number,
  excludedRules?: ExcludedRuleProperty[],
  overrideAction: RuleAction = 'none',
): RuleProperty => ({
  priority: priority,
  overrideAction: { [overrideAction]: {} },
  visibilityConfig: {
    sampledRequestsEnabled: false,
    cloudWatchMetricsEnabled: false,
    metricName: 'AWS-AWSManagedRulesAmazonIpReputationList',
  },
  name: 'AWS-AWSManagedRulesAmazonIpReputationList',
  statement: {
    managedRuleGroupStatement: {
      vendorName: 'AWS',
      name: 'AWSManagedRulesAmazonIpReputationList',
      excludedRules: excludedRules,
    },
  },
});

export const commonRule = (priority: number, excludedRules?: ExcludedRuleProperty[], overrideAction: RuleAction = 'none'): RuleProperty => ({
  priority: priority,
  overrideAction: { [overrideAction]: {} },
  visibilityConfig: {
    sampledRequestsEnabled: false,
    cloudWatchMetricsEnabled: false,
    metricName: 'AWS-AWSManagedRulesCommonRuleSet',
  },
  name: 'AWS-AWSManagedRulesCommonRuleSet',
  statement: {
    managedRuleGroupStatement: {
      vendorName: 'AWS',
      name: 'AWSManagedRulesCommonRuleSet',
      excludedRules: excludedRules,
    },
  },
});

export const knownBadInputsRule = (priority: number, excludedRules?: ExcludedRuleProperty[], overrideAction: RuleAction = 'none'): RuleProperty => ({
  priority: priority,
  overrideAction: { [overrideAction]: {} },
  visibilityConfig: {
    sampledRequestsEnabled: false,
    cloudWatchMetricsEnabled: false,
    metricName: 'AWS-AWSManagedRulesKnownBadInputsRuleSet',
  },
  name: 'AWS-AWSManagedRulesKnownBadInputsRuleSet',
  statement: {
    managedRuleGroupStatement: {
      vendorName: 'AWS',
      name: 'AWSManagedRulesKnownBadInputsRuleSet',
      excludedRules: excludedRules,
    },
  },
});
