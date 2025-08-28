#!/bin/bash

# Simple swap test script to debug the issue

echo "Testing swap setup components..."

# Test 1: Check if we can run basic commands
echo "Test 1: Basic command execution"
if command -v free >/dev/null 2>&1; then
    echo "✓ free command available"
else
    echo "✗ free command not available"
fi

# Test 2: Check memory info
echo "Test 2: Memory information"
if [ -f /proc/meminfo ]; then
    echo "✓ /proc/meminfo available"
    grep '^MemTotal:' /proc/meminfo | head -1
else
    echo "✗ /proc/meminfo not available"
fi

# Test 3: Test free command output
echo "Test 3: free command output"
if command -v free >/dev/null 2>&1; then
    echo "free -m output:"
    free -m | head -3
else
    echo "free command not available"
fi

# Test 4: Test awk parsing
echo "Test 4: awk parsing test"
if command -v awk >/dev/null 2>&1; then
    echo "✓ awk available"
    # Test the exact command that was failing
    if free -m | awk '/^Mem:/{print $2}' >/dev/null 2>&1; then
        echo "✓ awk parsing works"
        free -m | awk '/^Mem:/{print $2}'
    else
        echo "✗ awk parsing failed"
    fi
else
    echo "✗ awk not available"
fi

# Test 5: Check shell version
echo "Test 5: Shell information"
echo "Shell: $SHELL"
echo "Shell version: $BASH_VERSION"
echo "Current user: $(whoami)"

echo "Test completed."
