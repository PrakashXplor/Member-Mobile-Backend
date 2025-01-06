import { JsonSchemaType, JsonSchemaVersion, Model, RestApi } from 'aws-cdk-lib/aws-apigateway';
import { Construct } from 'constructs';

export class LoginResponseModel extends Model {
  constructor(scope: Construct, apiGateway: RestApi) {
    super(scope, 'LoginResponseModel', {
      restApi: apiGateway,
      modelName: 'LoginResponse',
      contentType: 'application/json',
      schema: {
        schema: JsonSchemaVersion.DRAFT4,
        type: JsonSchemaType.OBJECT,
        required: ['token'],
        properties: {
          token: { type: JsonSchemaType.STRING },
        },
      },
    });
  }
}
