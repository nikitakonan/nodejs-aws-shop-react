import * as cdk from 'aws-cdk-lib';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront';
import { Construct } from 'constructs';
import * as origins from 'aws-cdk-lib/aws-cloudfront-origins';
import * as s3Deployment from 'aws-cdk-lib/aws-s3-deployment';

const BUCKET_NAME = 'nikitakonan-test-web-app';
const DISTRIBUTION_NAME = 'MyReactAppDistribution';

export class InfrastructureStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const bucket = new s3.Bucket(this, BUCKET_NAME, {
      websiteIndexDocument: 'index.html',
      publicReadAccess: true,
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ACLS,
    });

    const distribution = new cloudfront.Distribution(this, DISTRIBUTION_NAME, {
      defaultBehavior: {
        origin: origins.S3BucketOrigin.withBucketDefaults(bucket),
      },
    });

    new s3Deployment.BucketDeployment(this, 'DeployApp', {
      sources: [s3Deployment.Source.asset('../dist')],
      destinationBucket: bucket,
      distribution,
    });
  }
}
