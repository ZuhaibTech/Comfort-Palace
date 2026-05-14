#!/bin/bash

# Reliable Backend Startup Script
# This script ensures the backend starts and stays running

BACKEND_DIR="/home/u300609276/backend"
NODE_PATH="/home/u300609276/.nvm/versions/node/v18.20.8/bin/node"
LOG_FILE="$BACKEND_DIR/backend.log"
PID_FILE="$BACKEND_DIR/backend.pid"

# Kill any existing backend processes
pkill -f "node server.js" 2>/dev/null || true
sleep 2

# Remove old PID file
rm -f "$PID_FILE"

# Start the backend
cd "$BACKEND_DIR"
echo "Starting backend at $(date)" >> "$LOG_FILE"
nohup "$NODE_PATH" server.js >> "$LOG_FILE" 2>&1 &
BACKEND_PID=$!
echo "$BACKEND_PID" > "$PID_FILE"

# Wait for startup
sleep 5

# Check if it's running
if kill -0 "$BACKEND_PID" 2>/dev/null; then
    echo "Backend started successfully with PID $BACKEND_PID"
    echo "Backend started successfully with PID $BACKEND_PID at $(date)" >> "$LOG_FILE"
    
    # Test the API
    sleep 2
    if curl -s -f http://127.0.0.1:3001/api/health > /dev/null 2>&1; then
        echo "API is responding correctly"
        echo "API is responding correctly at $(date)" >> "$LOG_FILE"
    else
        echo "WARNING: Backend started but API not responding"
        echo "WARNING: Backend started but API not responding at $(date)" >> "$LOG_FILE"
    fi
else
    echo "Failed to start backend"
    echo "Failed to start backend at $(date)" >> "$LOG_FILE"
    rm -f "$PID_FILE"
    exit 1
fi
















