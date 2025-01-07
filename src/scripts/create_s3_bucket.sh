#!/bin/bash

# Configuration
LOCALSTACK_ENDPOINT="http://localhost:4566"
BUCKET_NAME="my-logging-bucket"

export AWS_ACCESS_KEY_ID="test"
export AWS_SECRET_ACCESS_KEY="test"
export AWS_DEFAULT_REGION='us-east-1'

# Wait until LocalStack is fully up
echo "Waiting for LocalStack to be ready..."
until curl -s $LOCALSTACK_ENDPOINT > /dev/null; do
  sleep 1
done

# Create the S3 bucket
echo "Creating S3 bucket: $BUCKET_NAME"
aws --endpoint-url=$LOCALSTACK_ENDPOINT s3api create-bucket --bucket $BUCKET_NAME

# List buckets to verify creation
echo "Listing all buckets:"
aws --endpoint-url=$LOCALSTACK_ENDPOINT s3api list-buckets
