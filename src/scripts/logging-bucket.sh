#!/bin/bash

# Create an S3 bucket using LocalStack's awslocal CLI
echo "s3 bucket creation"
awslocal s3api create-bucket --bucket my-logging-bucket --region us-east-1