import { JsonSchemaType, JsonSchemaVersion, Model, RestApi } from 'aws-cdk-lib/aws-apigateway';
import { Construct } from 'constructs';

export class LoginRequestModel extends Model {
  constructor(scope: Construct, apiGateway: RestApi) {
    super(scope, 'LoginRequestModel', {
      restApi: apiGateway,
      modelName: 'LoginRequest',
      schema: {
        schema: JsonSchemaVersion.DRAFT4,
        type: JsonSchemaType.OBJECT,
        required: ['username', 'password'],
        properties: {
          username: { type: JsonSchemaType.STRING },
          password: { type: JsonSchemaType.STRING },
        },
      },
    });
  }
}