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

print_status "Starting optimized build process..."

# Set memory options for Node.js and Bun (reduced for 2GB RAM server)
export NODE_OPTIONS="--max-old-space-size=1536"
export BUN_OPTIONS="--max-old-space-size=1536"

print_status "Memory options set:"
print_status "  NODE_OPTIONS: $NODE_OPTIONS"
print_status "  BUN_OPTIONS: $BUN_OPTIONS"

# Clean previous build artifacts
print_status "Cleaning previous build artifacts..."
rm -rf .next
rm -rf .bun

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

# Run the build (with timeout on Linux, without on macOS)
print_status "Starting build process..."
if command -v timeout >/dev/null 2>&1; then
    print_status "Using timeout command (Linux detected)"
    timeout 1800 bun run build
else
    print_status "No timeout command available (macOS detected), running build directly"
    bun run build
fi

# Check build result
if [ $? -eq 0 ]; then
    print_success "Build completed successfully!"
    print_status "Build artifacts created in .next/ directory"
else
    print_error "Build failed or timed out"
    exit 1
fi
