import { Stack, StackProps } from 'aws-cdk-lib';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront';
import { Construct } from 'constructs';

export class s3BucketStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const s3Bucket: s3.IBucket = new s3.Bucket(this, 'guideFiles',{
      objectOwnership: s3.ObjectOwnership.BUCKET_OWNER_ENFORCED,
      publicReadAccess: true
    })
    
    const cloudfrontDist = new cloudfront.CloudFrontWebDistribution(this, 'tourGuidesApp', {
      originConfigs: [{
        s3OriginSource: {
          s3BucketSource: s3Bucket
        },
        behaviors : [ {isDefaultBehavior: true}]
      }]
    })

    s3Bucket.grantWrite(new iam.AccountPrincipal('230009180509'));
  }
}
