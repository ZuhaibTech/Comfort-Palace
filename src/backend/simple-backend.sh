#!/bin/bash

# Simple Backend Runner Script
# This script runs the backend and restarts it if it crashes

BACKEND_DIR="/home/u300609276/backend"
NODE_PATH="/home/u300609276/.nvm/versions/node/v18.20.8/bin/node"
LOG_FILE="$BACKEND_DIR/simple-backend.log"
PID_FILE="$BACKEND_DIR/backend.pid"

log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" | tee -a "$LOG_FILE"
}

start_backend() {
    cd "$BACKEND_DIR"
    
    # Kill any existing backend process
    if [ -f "$PID_FILE" ]; then
        OLD_PID=$(cat "$PID_FILE")
        if kill -0 "$OLD_PID" 2>/dev/null; then
            log "Killing existing backend process $OLD_PID"
            kill "$OLD_PID"
            sleep 2
        fi
        rm -f "$PID_FILE"
    fi
    
    # Start the backend
    log "Starting backend..."
    nohup "$NODE_PATH" server.js >> "$LOG_FILE" 2>&1 &
    BACKEND_PID=$!
    echo "$BACKEND_PID" > "$PID_FILE"
    
    # Wait a moment and check if it's running
    sleep 3
    if kill -0 "$BACKEND_PID" 2>/dev/null; then
        log "Backend started successfully with PID $BACKEND_PID"
        return 0
    else
        log "Failed to start backend"
        rm -f "$PID_FILE"
        return 1
    fi
}

check_backend() {
    if [ ! -f "$PID_FILE" ]; then
        return 1
    fi
    
    PID=$(cat "$PID_FILE")
    if ! kill -0 "$PID" 2>/dev/null; then
        log "Backend process $PID is not running"
        rm -f "$PID_FILE"
        return 1
    fi
    
    # Check if API is responding
    if ! curl -s -f --max-time 5 http://127.0.0.1:3001/api/health > /dev/null 2>&1; then
        log "Backend process running but API not responding"
        return 1
    fi
    
    return 0
}

# Main loop
log "Simple backend manager started"

while true; do
    if ! check_backend; then
        log "Backend is down, restarting..."
        if start_backend; then
            log "Backend restarted successfully"
        else
            log "Failed to restart backend, waiting 30 seconds..."
            sleep 30
        fi
    else
        log "Backend is healthy"
    fi
    
    # Wait 30 seconds before next check
    sleep 30
done





