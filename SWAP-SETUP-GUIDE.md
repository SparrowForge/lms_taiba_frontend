# Swap Memory Setup Guide for LMS Taiba Admin Panel

## Overview

This guide helps you set up swap memory on your server to handle the 2GB RAM limitation. Swap memory acts as virtual RAM using disk space.

## Quick Setup (Recommended)

### Option 1: Automated Script

```bash
# Make script executable (if not already done)
chmod +x setup-swap.sh

# Run the script as root
sudo ./setup-swap.sh
```

### Option 2: Manual Setup

#### Step 1: Check Current Memory

```bash
free -h
swapon --show
```

#### Step 2: Create Swap File (4GB for 2GB RAM)

```bash
# Create 4GB swap file
sudo fallocate -l 4G /swapfile

# If fallocate fails, use dd
sudo dd if=/dev/zero of=/swapfile bs=1G count=4

# Set proper permissions
sudo chmod 600 /swapfile
```

#### Step 3: Format and Enable Swap

```bash
# Format as swap
sudo mkswap /swapfile

# Enable swap
sudo swapon /swapfile
```

#### Step 4: Make Swap Permanent

```bash
# Add to /etc/fstab
echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
```

#### Step 5: Optimize Swap Settings

```bash
# Create optimization file
sudo tee /etc/sysctl.d/99-swap.conf << EOF
vm.swappiness = 10
vm.vfs_cache_pressure = 50
EOF

# Apply settings
sudo sysctl -p /etc/sysctl.d/99-swap.conf
```

## Verification

### Check Swap Status

```bash
# Verify swap is active
swapon --show

# Check memory usage
free -h

# Check swap settings
sysctl vm.swappiness vm.vfs_cache_pressure
```

### Expected Output

```
NAME      TYPE      SIZE USED PRIO
/swapfile file        4G   0B   -2

              total        used        free      shared  buff/cache   available
Mem:          1.9Gi       1.2Gi       200Mi       0.0Ki       500Mi       600Mi
Swap:         4.0Gi          0B       4.0Gi

vm.swappiness = 10
vm.vfs_cache_pressure = 50
```

## Docker Considerations

Your `docker-compose.yml` already has memory limits:

```yaml
deploy:
  resources:
    limits:
      memory: 2G
    reservations:
      memory: 1G
```

With swap enabled:

- Docker containers can use up to 2GB RAM
- If RAM is exhausted, swap will be used
- Prevents out-of-memory crashes
- Performance may degrade when using swap

## Monitoring

### Check Swap Usage

```bash
# Real-time memory monitoring
watch -n 1 'free -h'

# Docker container stats
docker stats

# System memory info
cat /proc/meminfo | grep -i swap
```

### Performance Monitoring

```bash
# Check if swap is being used
vmstat 1 5

# Monitor swap activity
iostat -x 1
```

## Troubleshooting

### Remove Swap (if needed)

```bash
# Turn off swap
sudo swapoff -a

# Remove swap file
sudo rm /swapfile

# Remove from fstab
sudo sed -i '/\/swapfile/d' /etc/fstab
```

### Common Issues

1. **Permission Denied**: Ensure script is run with `sudo`
2. **Insufficient Disk Space**: Check available disk space with `df -h`
3. **Swap Not Persisting**: Verify `/etc/fstab` entry is correct
4. **Performance Issues**: Monitor swap usage and consider RAM upgrade

## Recommendations

1. **For 2GB RAM servers**: Use 4GB swap (2x RAM)
2. **Monitor usage**: High swap usage indicates need for more RAM
3. **Performance**: Swap is 1000x slower than RAM
4. **Upgrade path**: Consider upgrading to 4GB+ RAM for production use

## Security Notes

- Swap file permissions are set to 600 (owner read/write only)
- Swap data is not encrypted by default
- Consider disk encryption for sensitive data

## Support

If you encounter issues:

1. Check the automated script output for errors
2. Verify disk space availability
3. Ensure you're running as root/sudo
4. Check system logs: `journalctl -xe`
