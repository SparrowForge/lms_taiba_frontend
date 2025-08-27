#!/bin/bash

# LMS Taiba Admin Panel Server Deployment Script
# This script will stop Docker Compose, pull latest changes from git, and rebuild
# Optimized for server environments (non-interactive)

set -e  # Exit on any error

# Colors for output (will be stripped if not supported)
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Check if we're in a terminal that supports colors
if [ -t 1 ]; then
    # Terminal supports colors
    USE_COLORS=true
else
    # Non-terminal environment (like cron or CI/CD), disable colors
    USE_COLORS=false
    RED=''
    GREEN=''
    YELLOW=''
    BLUE=''
    NC=''
fi

# Function to print colored output
print_status() {
    if [ "$USE_COLORS" = true ]; then
        echo -e "${BLUE}[INFO]${NC} $1"
    else
        echo "[INFO] $1"
    fi
}

print_success() {
    if [ "$USE_COLORS" = true ]; then
        echo -e "${GREEN}[SUCCESS]${NC} $1"
    else
        echo "[SUCCESS] $1"
    fi
}

print_warning() {
    if [ "$USE_COLORS" = true ]; then
        echo -e "${YELLOW}[WARNING]${NC} $1"
    else
        echo "[WARNING] $1"
    fi
}

print_error() {
    if [ "$USE_COLORS" = true ]; then
        echo -e "${RED}[ERROR]${NC} $1"
    else
        echo "[ERROR] $1"
    fi
}

# Function to check if Docker is running
check_docker() {
    if ! docker info > /dev/null 2>&1; then
        print_error "Docker is not running. Please start Docker and try again."
        exit 1
    fi
    print_success "Docker is running"
}

# Function to check if Docker Compose is available
check_docker_compose() {
    if docker compose version > /dev/null 2>&1; then
        COMPOSE_CMD="docker compose"
        print_success "Docker Compose is available"
    else
        print_error "Docker Compose is not available. Please install Docker Compose and try again."
        exit 1
    fi
}

# Function to check if git is available
check_git() {
    if ! git --version > /dev/null 2>&1; then
        print_error "Git is not available. Please install Git and try again."
        exit 1
    fi
    print_success "Git is available"
}

# Function to stop Docker Compose services
stop_services() {
    print_status "Stopping Docker Compose services..."
    if $COMPOSE_CMD down; then
        print_success "Docker Compose services stopped successfully"
    else
        print_warning "Some services may not have been running or there was an issue stopping them"
    fi
}

# Function to pull latest changes from git
pull_changes() {
    print_status "Pulling latest changes from git..."
    
    # Check if we're in a git repository
    if ! git rev-parse --git-dir > /dev/null 2>&1; then
        print_error "Not in a git repository. Please run this script from the project root."
        exit 1
    fi
    
    # Check if there are uncommitted changes
    if ! git diff-index --quiet HEAD --; then
        print_warning "You have uncommitted changes. Stashing them for deployment..."
        git stash push -m "Auto-stashed by deployment script $(date)"
    fi
    
    # Get current branch
    CURRENT_BRANCH=$(git branch --show-current)
    print_status "Current branch: $CURRENT_BRANCH"
    
    # Fetch latest changes
    print_status "Fetching latest changes..."
    if ! git fetch origin; then
        print_error "Failed to fetch changes from git"
        exit 1
    fi
    
    # Pull latest changes
    if git pull origin $CURRENT_BRANCH; then
        print_success "Successfully pulled latest changes from git"
    else
        print_error "Failed to pull changes from git"
        exit 1
    fi
}

# Function to rebuild and start Docker Compose services
rebuild_services() {
    print_status "Rebuilding Docker Compose services..."
    
    # Set memory optimization for build process
    export NODE_OPTIONS="--max-old-space-size=2048"
    export BUN_OPTIONS="--max-old-space-size=2048"
    
    # Build and start services
    if $COMPOSE_CMD up --build -d; then
        print_success "Docker Compose services rebuilt and started successfully"
    else
        print_error "Failed to rebuild and start Docker Compose services"
        exit 1
    fi
}

# Function to show service status
show_status() {
    print_status "Checking service status..."
    $COMPOSE_CMD ps
    
    print_status "Recent logs:"
    $COMPOSE_CMD logs --tail=20
}

# Function to cleanup old images (automatic on server)
cleanup_images() {
    print_status "Cleaning up unused Docker images..."
    docker image prune -f
    print_success "Cleanup completed"
}

# Function to wait for services to be healthy
wait_for_health() {
    print_status "Waiting for services to be healthy..."
    local max_attempts=30
    local attempt=1
    
    while [ $attempt -le $max_attempts ]; do
        if $COMPOSE_CMD ps | grep -q "healthy"; then
            print_success "Services are healthy"
            return 0
        fi
        
        print_status "Waiting for services to be healthy... (attempt $attempt/$max_attempts)"
        sleep 10
        attempt=$((attempt + 1))
    done
    
    print_warning "Services may not be fully healthy yet, but deployment completed"
    return 0
}

# Function to log deployment
log_deployment() {
    local log_file="/var/log/lms-deployments.log"
    local timestamp=$(date '+%Y-%m-%d %H:%M:%S')
    local branch=$(git branch --show-current)
    local commit=$(git rev-parse --short HEAD)
    
    echo "[$timestamp] Deployment completed - Branch: $branch, Commit: $commit" >> "$log_file" 2>/dev/null || true
}

# Main execution
main() {
    echo "=========================================="
    echo "LMS Taiba Admin Panel Server Deployment"
    echo "=========================================="
    echo
    
    # Check prerequisites
    print_status "Checking prerequisites..."
    check_docker
    check_docker_compose
    check_git
    echo
    
    # Execute deployment steps
    stop_services
    echo
    
    pull_changes
    echo
    
    rebuild_services
    echo
    
    # Wait for services to be healthy
    wait_for_health
    echo
    
    # Automatic cleanup on server
    cleanup_images
    echo
    
    # Show final status
    show_status
    echo
    
    # Log deployment
    log_deployment
    
    print_success "Deployment completed successfully!"
    print_status "Your application should be available at: http://localhost:3002"
    
    # Show external URL if available
    if [ -n "$NEXT_PUBLIC_APP_URL" ]; then
        print_status "External URL: $NEXT_PUBLIC_APP_URL"
    fi
}

# Handle script interruption
trap 'print_error "Script interrupted"; exit 1' INT TERM

# Run main function
main "$@" 