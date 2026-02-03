#!/bin/zsh
set -e

# Build from Dockerfile
echo "Building Docker image..."
docker build --platform linux/amd64 -t avalog/api:latest .

# Save docker image created
echo "Deploying to avalog.online (this may take a while)..."
docker save avalog/api:latest | gzip | ssh root@avalog.online 'gunzip | docker load'
echo "Deployment complete!"
