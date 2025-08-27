#!/bin/bash

# Memory-Optimized Build Script for LMS Taiba Admin Panel
# This script handles builds in memory-constrained environments

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

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

# Set aggressive memory optimization
export NODE_OPTIONS="--max-old-space-size=2048 --optimize-for-size"
export BUN_OPTIONS="--max-old-space-size=2048"
export NEXT_TELEMETRY_DISABLED=1
export NODE_ENV=production

print_status "Starting memory-optimized build..."
print_status "Memory settings:"
print_status "  NODE_OPTIONS: $NODE_OPTIONS"
print_status "  BUN_OPTIONS: $BUN_OPTIONS"

# Clean previous build
print_status "Cleaning previous build..."
rm -rf .next
rm -rf .bun

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    print_status "Installing dependencies..."
    bun install --frozen-lockfile
fi

# Build with memory monitoring
print_status "Starting build process..."
print_status "This may take several minutes..."

# Use timeout to prevent infinite hanging
timeout 1800 bun run build || {
    if [ $? -eq 124 ]; then
        print_error "Build timed out after 30 minutes"
        exit 1
    else
        print_error "Build failed with exit code $?"
        exit 1
    fi
}

print_success "Build completed successfully!"
print_status "Build artifacts created in .next/ directory"
