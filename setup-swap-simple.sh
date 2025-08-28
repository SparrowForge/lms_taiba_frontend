#!/bin/bash

# Simplified Swap Setup Script - Bulletproof version
# This script avoids complex parsing that might cause syntax errors

set -e

echo "=========================================="
echo "Simple Swap Setup for 2GB RAM Server"
echo "=========================================="
echo

# Check if running as root
if [[ $EUID -ne 0 ]]; then
    echo "ERROR: This script must be run as root (use sudo)"
    exit 1
fi

echo "✓ Running as root"

# Check current swap
echo "Checking current swap status..."
if swapon --show | grep -q "swapfile"; then
    echo "WARNING: Swap file already exists!"
    swapon --show
    free -h
    echo
    read -p "Remove existing swap and recreate? (y/N): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        echo "Removing existing swap..."
        swapoff -a 2>/dev/null || true
        rm -f /swapfile
        sed -i '/\/swapfile/d' /etc/fstab 2>/dev/null || true
        echo "✓ Existing swap removed"
    else
        echo "Keeping existing swap"
        exit 0
    fi
else
    echo "✓ No existing swap found"
fi

# Set fixed swap size for 2GB RAM server (4GB swap)
SWAP_SIZE_MB=4096
echo "Setting swap size to ${SWAP_SIZE_MB}MB (4GB)"

# Create swap file
echo "Creating swap file..."
if fallocate -l ${SWAP_SIZE_MB}M /swapfile 2>/dev/null; then
    echo "✓ Swap file created with fallocate"
else
    echo "fallocate failed, using dd method..."
    if dd if=/dev/zero of=/swapfile bs=1M count=$SWAP_SIZE_MB 2>/dev/null; then
        echo "✓ Swap file created with dd"
    else
        echo "ERROR: Failed to create swap file"
        exit 1
    fi
fi

# Set permissions
chmod 600 /swapfile
echo "✓ Permissions set"

# Format as swap
if mkswap /swapfile >/dev/null 2>&1; then
    echo "✓ Swap file formatted"
else
    echo "ERROR: Failed to format swap file"
    exit 1
fi

# Enable swap
if swapon /swapfile; then
    echo "✓ Swap enabled"
else
    echo "ERROR: Failed to enable swap"
    exit 1
fi

# Add to fstab
echo "/swapfile none swap sw 0 0" >> /etc/fstab
echo "✓ Swap added to /etc/fstab"

# Configure swap settings
echo "Configuring swap settings..."
cat > /etc/sysctl.d/99-swap.conf << 'EOF'
# Swap optimization settings
vm.swappiness = 10
vm.vfs_cache_pressure = 50
EOF

sysctl -p /etc/sysctl.d/99-swap.conf >/dev/null 2>&1 || true
echo "✓ Swap settings configured"

# Show results
echo
echo "=========================================="
echo "Swap Setup Complete!"
echo "=========================================="
echo
echo "Current swap status:"
swapon --show
echo
echo "Memory usage:"
free -h
echo
echo "Swap settings:"
sysctl vm.swappiness vm.vfs_cache_pressure 2>/dev/null || echo "Settings applied"
echo
echo "✓ Swap setup completed successfully!"
echo "✓ 4GB swap file created and enabled"
echo "✓ Configuration will persist after reboot"
echo
echo "You can now run your deployment:"
echo "  sudo ./deploy-server.sh"
