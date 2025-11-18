#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored status messages
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

print_status "Starting local build process..."

# Set memory options for local build (can use more memory locally)
export NODE_OPTIONS="--max-old-space-size=4096 --max-semi-space-size=256"
export BUN_OPTIONS="--max-old-space-size=4096"

# Force production environment for server deployment
export NODE_ENV=production
export NEXT_PUBLIC_API_BASE_URL="http://79.132.131.161:3001/api/v1"

print_status "Memory options set for local build:"
print_status "  NODE_OPTIONS: $NODE_OPTIONS"
print_status "  BUN_OPTIONS: $BUN_OPTIONS"
print_status "  NODE_ENV: $NODE_ENV"
print_status "  API_BASE_URL: $NEXT_PUBLIC_API_BASE_URL"

# Clean previous build artifacts
print_status "Cleaning previous build artifacts..."
rm -rf .next
rm -rf .bun
rm -rf node_modules/.cache

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    print_status "Installing dependencies..."
    bun install --frozen-lockfile
    if [ $? -ne 0 ]; then
        print_error "Failed to install dependencies"
        exit 1
    fi
    print_success "Dependencies installed successfully"
else
    print_status "Dependencies already installed, skipping installation"
fi

# Run the build
print_status "Starting build process..."
bun run build

# Check build result
if [ $? -eq 0 ]; then
    print_success "Build completed successfully!"
    print_status "Build artifacts created in .next/ directory"
    
    # Show build size information
    if [ -d ".next" ]; then
        print_status "Build size information:"
        du -sh .next/ 2>/dev/null || print_warning "Could not calculate build size"
        
        # Create build info file
        echo "Build completed at: $(date)" > .next/build-info.txt
        echo "Build size: $(du -sh .next/ | cut -f1)" >> .next/build-info.txt
        echo "Node version: $(node --version)" >> .next/build-info.txt
        echo "Bun version: $(bun --version)" >> .next/build-info.txt
    fi
    
    # Create deployment package
    print_status "Creating deployment package..."
    tar -czf build-package.tar.gz .next/ public/ package.json Dockerfile.prebuilt deploy-simple.sh
    print_success "Deployment package created: build-package.tar.gz"
    
    print_status "Next steps:"
    print_status "1. Upload build-package.tar.gz to your server manually"
    print_status "2. SSH into your server and run: ./deploy-simple.sh"
    print_status "3. Your app will be running on port 3002"
    
else
    print_error "Build failed"
    exit 1
fi
