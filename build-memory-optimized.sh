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

print_status "Starting memory-optimized build process..."

# Set aggressive memory options for Node.js and Bun
export NODE_OPTIONS="--max-old-space-size=2560 --max-semi-space-size=256 --optimize-for-size"
export BUN_OPTIONS="--max-old-space-size=2560"

# Additional memory optimization environment variables
export NODE_GC_INTERVAL=100
export NODE_GC_OLD_SPACE_SIZE=2560
export NODE_GC_NEW_SPACE_SIZE=128

print_status "Memory options set:"
print_status "  NODE_OPTIONS: $NODE_OPTIONS"
print_status "  BUN_OPTIONS: $BUN_OPTIONS"
print_status "  NODE_GC_INTERVAL: $NODE_GC_INTERVAL"
print_status "  NODE_GC_OLD_SPACE_SIZE: $NODE_GC_OLD_SPACE_SIZE"
print_status "  NODE_GC_NEW_SPACE_SIZE: $NODE_GC_NEW_SPACE_SIZE"

# Clean previous build artifacts
print_status "Cleaning previous build artifacts..."
rm -rf .next
rm -rf .bun
rm -rf node_modules/.cache

# Check if node_modules exists, install if missing
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

# Run the build with memory monitoring
print_status "Starting build process with memory monitoring..."
if command -v timeout >/dev/null 2>&1; then
    print_status "Using timeout command (Linux detected)"
    timeout 3600 bun run build
else
    print_status "No timeout command available (macOS detected), running build directly"
    bun run build
fi

# Check build result
if [ $? -eq 0 ]; then
    print_success "Build completed successfully!"
    print_status "Build artifacts created in .next/ directory"
    
    # Show build size information
    if [ -d ".next" ]; then
        print_status "Build size information:"
        du -sh .next/ 2>/dev/null || print_warning "Could not calculate build size"
    fi
else
    print_error "Build failed or timed out"
    exit 1
fi
