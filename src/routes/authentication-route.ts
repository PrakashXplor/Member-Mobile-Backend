import { Construct } from 'constructs';
import { PhpApiProxyRoute } from './php-api-proxy-route';
import { IntegrationResponse, IRequestValidator, RestApi } from 'aws-cdk-lib/aws-apigateway';
import { EnvironmentContext } from '../utils/validate-environment-context';
import { LoginRequestModel } from '../models/request/login-request-model';
import { LoginResponseModel } from '../models/response/login-response-model';

interface AuthenticationProps{
  environmentContext: EnvironmentContext;
  gateway: RestApi;
  defaultIntegrationResponses: IntegrationResponse[];
  requestValidator: IRequestValidator;
}

export class AuthenticationRoute extends Construct {
  constructor(scope: Construct, id: string, props: AuthenticationProps) {
    super(scope, id);

    const authentication = props.gateway.root.addResource('authentication');

    new PhpApiProxyRoute(this,'LoginRoute', {
      environmentContext: props.environmentContext,
      resource: authentication,
      method: 'POST',
      httpIntegrationProps: {
        httpMethod: 'POST',
        proxy: false,
        options: {
          requestParameters: {
            // we don't want prettier to undo the application/json being in single quotes required by aws
            // prettier-ignore
            'integration.request.header.Content-Type': '\'application/json\'',
            'integration.request.header.referer': 'method.request.header.referer',
            'integration.request.header.x-e2e': 'method.request.querystring.e2e',
          },
          requestTemplates: {
            'application/json': '{"username": $input.json(\'$.username\'), "password": $input.json(\'$.password\')}',
          },
          integrationResponses: [
            ...props.defaultIntegrationResponses,
            {
              statusCode: '200',
              selectionPattern: '200',
              responseTemplates: {
                'application/json': '{"token": $input.json(\'$.token\')}',
              },
            },
          ],
        },
      },
      apiPath: '/api/auth_check',
      methodOptions: {
        requestParameters: {
          'method.request.querystring.e2e': false,
          'method.request.header.referer': true,
        },
        requestValidator: props.requestValidator,
        requestModels: {
          'application/json': new LoginRequestModel(this, props.gateway),
        },
        methodResponses: [
          {
            statusCode: '200',
            responseModels: {
              'application/json': new LoginResponseModel(this, props.gateway),
            },
          },
        ],
      },
    });
  }
}
