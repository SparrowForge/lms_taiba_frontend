#!/bin/bash

# 🚀 LMS Frontend Docker Deployment Script
# Re-implemented for optimized deployment
# Usage: ./deploy.sh [dev|prod] [build|up|down|restart|logs|clean]

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Script configuration
COMPOSE_FILE="docker-compose.yml"
DEV_COMPOSE_FILE="docker-compose.dev.yml"

print_status() { echo -e "${BLUE}[INFO]${NC} $1"; }
print_success() { echo -e "${GREEN}[SUCCESS]${NC} $1"; }
print_warning() { echo -e "${YELLOW}[WARNING]${NC} $1"; }
print_error() { echo -e "${RED}[ERROR]${NC} $1"; }

# Main script logic
main() {
    local env_mode="$1"
    local command="$2"

    if [[ -z "$env_mode" || -z "$command" ]]; then
        print_error "Usage: ./deploy.sh [dev|prod] [build|up|down|restart|logs|clean]"
        exit 1
    fi

    # Set compose file based on environment
    if [[ "$env_mode" == "dev" ]]; then
        FILE="$DEV_COMPOSE_FILE"
    elif [[ "$env_mode" == "prod" ]]; then
        FILE="$COMPOSE_FILE"
    else
        print_error "Invalid environment mode: $env_mode (use 'dev' or 'prod')"
        exit 1
    fi

    if [[ ! -f "$FILE" ]]; then
        print_error "Compose file $FILE not found!"
        exit 1
    fi

    case "$command" in
        "build")
            print_status "Building Docker images for $env_mode..."
            docker compose -f "$FILE" build
            ;;
        "up")
            print_status "Starting containers for $env_mode..."
            docker compose -f "$FILE" up -d
            print_success "Deployment complete!"
            ;;
        "down")
            print_status "Stopping containers for $env_mode..."
            docker compose -f "$FILE" down
            ;;
        "restart")
            print_status "Restarting containers for $env_mode..."
            docker compose -f "$FILE" restart
            ;;
        "logs")
            docker compose -f "$FILE" logs -f
            ;;
        "clean")
            print_warning "Cleaning up $env_mode resources..."
            docker compose -f "$FILE" down -v --remove-orphans
            ;;
        *)
            print_error "Unknown command: $command"
            exit 1
            ;;
    esac
}

main "$@"
