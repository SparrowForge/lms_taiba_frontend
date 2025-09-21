#!/bin/bash

# Simple deployment script - no Docker Compose required
echo "🚀 Deploying LMS Admin Panel..."

# Stop existing container
echo "Stopping existing container..."
docker stop lms-admin-panel 2>/dev/null || true
docker rm lms-admin-panel 2>/dev/null || true

# Extract build package
echo "Extracting build package..."
tar -xzf build-package.tar.gz

# Build Docker image
echo "Building Docker image..."
docker build -f Dockerfile.prebuilt -t lms-admin-panel .

# Run the application
echo "Starting application..."
docker run -d \
    --name lms-admin-panel \
    -p 3002:3000 \
    --restart unless-stopped \
    lms-admin-panel

# Show status
echo "✅ Deployment complete!"
echo "🌐 Application running at: http://localhost:3002"
echo "📋 View logs: docker logs -f lms-admin-panel"
echo "🛑 Stop app: docker stop lms-admin-panel"

# Clean up
rm -f build-package.tar.gz
