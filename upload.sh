#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
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

print_progress() {
    echo -e "${CYAN}[PROGRESS]${NC} $1"
}

# Server configuration
SERVER_USER="root"
SERVER_HOST="79.132.131.161"
SERVER_PATH="/home/lms_taiba_frontend_build"
LOCAL_BUILD_PATH="./build-package.tar.gz"
PASSWORD="HnyAgSeuJKNQ!Awz3rJu"

print_status "Upload and deploy script with progress indicators"
print_status "Server: $SERVER_USER@$SERVER_HOST:$SERVER_PATH"

# Check if build package exists
if [ ! -f "$LOCAL_BUILD_PATH" ]; then
    print_error "Build package not found: $LOCAL_BUILD_PATH"
    print_status "Please run ./build-local.sh first to create the build package"
    exit 1
fi

# Get file size
FILE_SIZE=$(du -h "$LOCAL_BUILD_PATH" | cut -f1)
print_status "Build package size: $FILE_SIZE"

# Install sshpass if not available
if ! command -v sshpass &> /dev/null; then
    print_status "Installing sshpass for password authentication..."
    if [[ "$OSTYPE" == "darwin"* ]]; then
        # macOS
        if command -v brew &> /dev/null; then
            brew install hudochenkov/sshpass/sshpass
        else
            print_error "Please install sshpass manually: brew install hudochenkov/sshpass/sshpass"
            exit 1
        fi
    else
        # Linux
        sudo apt-get update && sudo apt-get install -y sshpass
    fi
fi

# Function to show progress bar
show_progress() {
    local current=$1
    local total=$2
    local width=50
    local percentage=$((current * 100 / total))
    local filled=$((current * width / total))
    local empty=$((width - filled))
    
    printf "\r["
    printf "%*s" $filled | tr ' ' '='
    printf "%*s" $empty | tr ' ' ' '
    printf "] %d%% (%d/%d)" $percentage $current $total
}

# Upload the build package with progress
print_status "Starting upload to server..."
print_progress "Connecting to server..."

# Create a temporary script for progress monitoring
cat > /tmp/upload_progress.sh << 'EOF'
#!/bin/bash
FILE="$1"
TOTAL_SIZE=$(stat -f%z "$FILE" 2>/dev/null || stat -c%s "$FILE" 2>/dev/null)
CURRENT_SIZE=0

# Monitor the file being uploaded
while [ $CURRENT_SIZE -lt $TOTAL_SIZE ]; do
    # Check if file exists on server (rough estimate)
    sleep 1
    CURRENT_SIZE=$((CURRENT_SIZE + 1024 * 100)) # Simulate progress
    if [ $CURRENT_SIZE -gt $TOTAL_SIZE ]; then
        CURRENT_SIZE=$TOTAL_SIZE
    fi
    
    # Show progress bar
    WIDTH=50
    PERCENTAGE=$((CURRENT_SIZE * 100 / TOTAL_SIZE))
    FILLED=$((CURRENT_SIZE * WIDTH / TOTAL_SIZE))
    EMPTY=$((WIDTH - FILLED))
    
    printf "\r["
    printf "%*s" $FILLED | tr ' ' '='
    printf "%*s" $EMPTY | tr ' ' ' '
    printf "] %d%%" $PERCENTAGE
done
echo ""
EOF

chmod +x /tmp/upload_progress.sh

# Start progress monitoring in background
/tmp/upload_progress.sh "$LOCAL_BUILD_PATH" &
PROGRESS_PID=$!

# Upload the file
sshpass -p "$PASSWORD" scp -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null "$LOCAL_BUILD_PATH" "$SERVER_USER@$SERVER_HOST:$SERVER_PATH/"

# Stop progress monitoring
kill $PROGRESS_PID 2>/dev/null
wait $PROGRESS_PID 2>/dev/null

# Clean up
rm -f /tmp/upload_progress.sh

if [ $? -eq 0 ]; then
    print_success "Build package uploaded successfully!"
else
    print_error "Failed to upload build package"
    exit 1
fi

# Connect to server and deploy with progress
print_status "Connecting to server for deployment..."
print_progress "Step 1/6: Stopping existing containers..."
sshpass -p "$PASSWORD" ssh -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null "$SERVER_USER@$SERVER_HOST" "docker stop lms-admin-panel 2>/dev/null || true; docker rm lms-admin-panel 2>/dev/null || true"

print_progress "Step 2/6: Extracting build package..."
sshpass -p "$PASSWORD" ssh -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null "$SERVER_USER@$SERVER_HOST" "cd $SERVER_PATH && tar -xzf build-package.tar.gz"

print_progress "Step 3/6: Setting permissions..."
sshpass -p "$PASSWORD" ssh -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null "$SERVER_USER@$SERVER_HOST" "cd $SERVER_PATH && chmod +x deploy-simple.sh"

print_progress "Step 4/6: Building Docker image..."
sshpass -p "$PASSWORD" ssh -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null "$SERVER_USER@$SERVER_HOST" "cd $SERVER_PATH && docker build -f Dockerfile.prebuilt -t lms-admin-panel ."

print_progress "Step 5/6: Starting application..."
sshpass -p "$PASSWORD" ssh -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null "$SERVER_USER@$SERVER_HOST" "cd $SERVER_PATH && docker run -d --name lms-admin-panel -p 3002:3000 --restart unless-stopped lms-admin-panel"

print_progress "Step 6/6: Verifying deployment..."
sshpass -p "$PASSWORD" ssh -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null "$SERVER_USER@$SERVER_HOST" "cd $SERVER_PATH && docker ps | grep lms-admin-panel && rm -f build-package.tar.gz"

if [ $? -eq 0 ]; then
    print_success "Deployment completed successfully!"
    print_status "Your application is now running at: http://79.132.131.161:3002"
    print_status "API is available at: http://79.132.131.161:3001/api/v1"
else
    print_error "Deployment failed"
    exit 1
fi
