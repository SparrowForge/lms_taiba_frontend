#!/bin/bash

# LMS Taiba Admin Panel Deployment Script
# This script will stop Docker Compose, pull latest changes from git, and rebuild

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
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
    if ! docker compose version > /dev/null 2>&1; then
        print_error "Docker Compose is not available. Please install Docker Compose and try again."
        exit 1
    fi
    print_success "Docker Compose is available"
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
    if docker compose down; then
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
        print_warning "You have uncommitted changes. Consider committing or stashing them before deployment."
        read -p "Do you want to continue anyway? (y/N): " -n 1 -r
        echo
        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            print_status "Deployment cancelled by user"
            exit 0
        fi
    fi
    
    # Get current branch
    CURRENT_BRANCH=$(git branch --show-current)
    print_status "Current branch: $CURRENT_BRANCH"
    
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
    
    # Build and start services
    if docker compose up --build -d; then
        print_success "Docker Compose services rebuilt and started successfully"
    else
        print_error "Failed to rebuild and start Docker Compose services"
        exit 1
    fi
}

# Function to show service status
show_status() {
    print_status "Checking service status..."
    docker compose ps
    
    print_status "Recent logs:"
    docker compose logs --tail=20
}

# Function to cleanup old images (optional)
cleanup_images() {
    print_status "Cleaning up unused Docker images..."
    docker image prune -f
    print_success "Cleanup completed"
}

# Main execution
main() {
    echo "=========================================="
    echo "LMS Taiba Admin Panel Deployment Script"
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
    
    # Optional cleanup
    read -p "Do you want to cleanup unused Docker images? (y/N): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        cleanup_images
        echo
    fi
    
    # Show final status
    show_status
    echo
    
    print_success "Deployment completed successfully!"
    print_status "Your application should be available at: http://localhost:3002"
}

# Handle script interruption
trap 'print_error "Script interrupted by user"; exit 1' INT TERM

# Run main function
main "$@" 