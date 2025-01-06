import { Construct } from 'constructs';
import { Effect, IPrincipal, IRole, Policy, PolicyStatement, Role } from 'aws-cdk-lib/aws-iam';
import { Stack } from 'aws-cdk-lib';

interface LogDeliveryRoleProps {
  deliveryBucketArn: string;
  prefix: string;
  assumedBy: IPrincipal;
  objectPath: 'WAF' | 'APIGateway';
}

export class LogDeliveryRole extends Construct {
  public readonly role: IRole;

  constructor(scope: Construct, id: string, props: LogDeliveryRoleProps) {
    super(scope, id);

    this.role = new Role(this, 'Role', {
      roleName: `${props.prefix}-KinesisLogDeliveryRole`,
      assumedBy: props.assumedBy,
    });

    new Policy(this, 'Policy', {
      roles: [this.role],
      statements: [
        new PolicyStatement({
          effect: Effect.ALLOW,
          actions: [
            's3:PutObject',
            's3:PutObjectAcl',
            's3:AbortMultipartUpload',
            's3:ListBucketMultipartUploads',
            's3:ListBucket',
            's3:GetBucketLocation',
            's3:GetObject',
          ],
          resources: [props.deliveryBucketArn, `${props.deliveryBucketArn}/AWSLogs/${Stack.of(this).account}/${props.objectPath}/*`],
        }),
      ],
    });
  }
}
