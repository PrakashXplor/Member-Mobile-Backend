import { Construct } from 'constructs';
import { NestedStack, NestedStackProps } from 'aws-cdk-lib';
import { Bucket, IBucket } from 'aws-cdk-lib/aws-s3';

export class ImportedResourcesStack extends NestedStack {
  public readonly logBucket: IBucket;

  constructor(scope: Construct, id: string, props: NestedStackProps) {
    super(scope, id, props);

    this.logBucket = Bucket.fromBucketAttributes(this, 'LogBucket', {
      account: '461879727377',
      bucketArn: 'arn:aws:s3:::logshipperstack-logbucket7273c8db-hbpx4euqdao6',
      bucketName: 'logshipperstack-logbucket7273c8db-hbpx4euqdao6',
      region: 'eu-west-1',
    });
  }
}
