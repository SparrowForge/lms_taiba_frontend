#!/bin/bash

# LMS Taiba Admin Panel - Swap Memory Setup Script
# This script will create and configure swap memory on your server
# Recommended for servers with limited RAM (2GB or less)

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

# Function to check if running as root
check_root() {
    if [[ $EUID -ne 0 ]]; then
        print_error "This script must be run as root (use sudo)"
        exit 1
    fi
}

# Function to check current swap status
check_swap_status() {
    print_status "Checking current swap status..."
    
    if swapon --show | grep -q "swapfile"; then
        print_warning "Swap file already exists!"
        swapon --show
        free -h
        echo
        read -p "Do you want to remove existing swap and recreate it? (y/N): " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            remove_existing_swap
        else
            print_status "Keeping existing swap configuration"
            exit 0
        fi
    else
        print_success "No existing swap found, proceeding with setup"
    fi
}

# Function to remove existing swap
remove_existing_swap() {
    print_status "Removing existing swap..."
    
    # Turn off swap
    swapoff -a 2>/dev/null || true
    
    # Remove swap file
    if [ -f /swapfile ]; then
        rm -f /swapfile
        print_success "Removed existing swap file"
    fi
    
    # Remove swap entry from fstab
    if grep -q "/swapfile" /etc/fstab; then
        sed -i '/\/swapfile/d' /etc/fstab
        print_success "Removed swap entry from /etc/fstab"
    fi
}

# Function to calculate optimal swap size
calculate_swap_size() {
    local total_ram=$(free -m | awk '/^Mem:/{print $2}')
    local swap_size
    
    if [ $total_ram -le 2048 ]; then
        # For 2GB or less RAM, use 2x RAM size
        swap_size=$((total_ram * 2))
        print_status "RAM: ${total_ram}MB, setting swap to ${swap_size}MB (2x RAM)"
    elif [ $total_ram -le 4096 ]; then
        # For 2-4GB RAM, use 1.5x RAM size
        swap_size=$((total_ram * 3 / 2))
        print_status "RAM: ${total_ram}MB, setting swap to ${swap_size}MB (1.5x RAM)"
    else
        # For 4GB+ RAM, use 1x RAM size
        swap_size=$total_ram
        print_status "RAM: ${total_ram}MB, setting swap to ${swap_size}MB (1x RAM)"
    fi
    
    echo $swap_size
}

# Function to create swap file
create_swap_file() {
    local swap_size_mb=$1
    local swap_size_gb=$((swap_size_mb / 1024))
    
    print_status "Creating swap file of ${swap_size_mb}MB (${swap_size_gb}GB)..."
    
    # Create swap file using fallocate (faster than dd)
    if fallocate -l ${swap_size_mb}M /swapfile; then
        print_success "Swap file created successfully"
    else
        print_warning "fallocate failed, trying dd method..."
        if dd if=/dev/zero of=/swapfile bs=1M count=$swap_size_mb; then
            print_success "Swap file created using dd"
        else
            print_error "Failed to create swap file"
            exit 1
        fi
    fi
    
    # Set proper permissions
    chmod 600 /swapfile
    
    # Make it a swap file
    if mkswap /swapfile; then
        print_success "Swap file formatted successfully"
    else
        print_error "Failed to format swap file"
        exit 1
    fi
}

# Function to enable swap
enable_swap() {
    print_status "Enabling swap..."
    
    if swapon /swapfile; then
        print_success "Swap enabled successfully"
    else
        print_error "Failed to enable swap"
        exit 1
    fi
}

# Function to configure swap in fstab
configure_fstab() {
    print_status "Configuring swap to persist after reboot..."
    
    # Add swap entry to fstab
    echo "/swapfile none swap sw 0 0" >> /etc/fstab
    
    if grep -q "/swapfile" /etc/fstab; then
        print_success "Swap configured in /etc/fstab"
    else
        print_error "Failed to configure swap in /etc/fstab"
        exit 1
    fi
}

# Function to configure swap settings
configure_swap_settings() {
    print_status "Configuring swap settings for better performance..."
    
    # Create sysctl configuration file
    cat > /etc/sysctl.d/99-swap.conf << EOF
# Swap optimization settings
vm.swappiness = 10
vm.vfs_cache_pressure = 50
EOF
    
    # Apply settings
    sysctl -p /etc/sysctl.d/99-swap.conf
    
    print_success "Swap settings configured"
}

# Function to show final status
show_final_status() {
    print_status "Final swap configuration:"
    echo
    swapon --show
    echo
    print_status "Memory usage:"
    free -h
    echo
    print_status "Swap settings:"
    sysctl vm.swappiness vm.vfs_cache_pressure
}

# Function to provide recommendations
show_recommendations() {
    echo
    print_status "Swap setup completed! Here are some recommendations:"
    echo
    echo "1. Monitor swap usage:"
    echo "   - Use 'free -h' to check memory and swap usage"
    echo "   - Use 'swapon --show' to see swap details"
    echo
    echo "2. Performance tips:"
    echo "   - Swap is much slower than RAM, so monitor usage"
    echo "   - Consider upgrading RAM if swap usage is consistently high"
    echo "   - The vm.swappiness=10 setting means the system will use swap less aggressively"
    echo
    echo "3. Docker considerations:"
    echo "   - Your docker-compose.yml already has memory limits set to 2GB"
    echo "   - Swap will help prevent out-of-memory crashes"
    echo "   - Monitor with 'docker stats' to see container memory usage"
}

# Main execution
main() {
    echo "=========================================="
    echo "LMS Taiba Admin Panel - Swap Setup"
    echo "=========================================="
    echo
    
    # Check if running as root
    check_root
    
    # Check current swap status
    check_swap_status
    
    # Calculate optimal swap size
    local swap_size=$(calculate_swap_size)
    
    # Create and configure swap
    create_swap_file $swap_size
    enable_swap
    configure_fstab
    configure_swap_settings
    
    # Show final status
    show_final_status
    
    # Show recommendations
    show_recommendations
    
    print_success "Swap setup completed successfully!"
}

# Handle script interruption
trap 'print_error "Script interrupted"; exit 1' INT TERM

# Run main function
main "$@"
