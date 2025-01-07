import { Construct } from 'constructs';
import { HttpIntegration, HttpIntegrationProps, MethodOptions, Resource } from 'aws-cdk-lib/aws-apigateway';
import { EnvironmentContext } from '../utils/validate-environment-context';

interface PhpApiProxyRouteProps {
  environmentContext: EnvironmentContext;
  resource: Resource;
  method: 'POST';
  methodOptions: MethodOptions;
  httpIntegrationProps: HttpIntegrationProps;
  apiPath: string;
}

export class PhpApiProxyRoute extends Construct {
  constructor(scope: Construct, id: string, props: PhpApiProxyRouteProps) {
    super(scope, id);

    const httpIntegration = new HttpIntegration(`https://${props.environmentContext.api.domain}${props.apiPath}`, props.httpIntegrationProps);

    props.resource.addMethod('POST', httpIntegration, props.methodOptions);
  }
}
