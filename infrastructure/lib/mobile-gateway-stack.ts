import { Construct } from 'constructs';
import { App, Stack, StackProps } from 'aws-cdk-lib';
import { EnvironmentContext } from '../../src/utils/validate-environment-context';
import { ImportedResourcesStack } from './nested-stacks/imported-resources-stack';
import { GatewayStack } from './nested-stacks/gateway-stack';

interface MobileGatewayStackProps extends StackProps {
  environmentContext: EnvironmentContext;
}

export class MobileGatewayStack extends Stack {
  public readonly importedResources: ImportedResourcesStack;
  public readonly gatewayStack: GatewayStack;

  constructor(scope: Construct, id: string, props: MobileGatewayStackProps) {
    super(scope, id, props);

    this.importedResources = new ImportedResourcesStack(this, 'ImportedResourcesStack', {
      description: 'Contains imported AWS resources for the mobile gateway',
    });

    this.gatewayStack = new GatewayStack(this, 'QueueStack', {
      description: 'Contains SQS queues / persistent queuing infrastructure',
      environmentContext: props.environmentContext,
      importedResourcesStack: this.importedResources,
    });
  }
}

export const createMobileGatewayStack = (props: { app: App; environmentContext: EnvironmentContext }) => {
  return new MobileGatewayStack(props.app, 'MobileGatewayStack', {
    description: 'Contains infrastructure for the mobile application API gateway',
    env: {
      account: props.environmentContext.aws.account.id,
      region: props.environmentContext.aws.account.region,
    },
    environmentContext: props.environmentContext,
  });
};
