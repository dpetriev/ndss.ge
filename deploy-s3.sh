#!/bin/bash

# Deploy to AWS S3
# Usage: ./deploy-s3.sh your-bucket-name

if [ -z "$1" ]; then
  echo "Usage: $0 <bucket-name>"
  echo "Example: $0 my-3d-studio-website"
  exit 1
fi

BUCKET_NAME=$1
REGION=${2:-us-east-1}

echo "Deploying to S3 bucket: $BUCKET_NAME"
echo "Region: $REGION"
echo ""

# Upload files
echo "Uploading files..."
aws s3 sync . s3://$BUCKET_NAME \
  --exclude ".git/*" \
  --exclude "*.log" \
  --exclude "*.sh" \
  --exclude ".gitignore" \
  --exclude "DEPLOYMENT.md" \
  --exclude "README.md" \
  --exclude ".vscode/*" \
  --exclude ".browser_screenshots/*" \
  --exclude ".downloads/*" \
  --delete

# Set correct content type for markdown files
echo "Setting content types..."
aws s3 cp s3://$BUCKET_NAME/blog/ s3://$BUCKET_NAME/blog/ \
  --recursive \
  --exclude "*" \
  --include "*.md" \
  --content-type "text/markdown; charset=utf-8" \
  --metadata-directive REPLACE

# Set content type for JSON
aws s3 cp s3://$BUCKET_NAME/blog/index.json s3://$BUCKET_NAME/blog/index.json \
  --content-type "application/json; charset=utf-8" \
  --metadata-directive REPLACE

echo ""
echo "✅ Deployment complete!"
echo ""
echo "Website URL: http://$BUCKET_NAME.s3-website-$REGION.amazonaws.com"
