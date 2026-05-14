#!/bin/bash

# Backend Monitoring Script
# This script monitors the backend and restarts it if it goes down

BACKEND_DIR="/home/u300609276/backend"
LOG_FILE="$BACKEND_DIR/monitor.log"

log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" | tee -a "$LOG_FILE"
}

check_backend() {
    # Check if backend process is running
    if ! pgrep -f "node server.js" > /dev/null; then
        return 1
    fi
    
    # Check if API is responding
    if ! curl -s -f --max-time 10 http://127.0.0.1:3001/api/health > /dev/null 2>&1; then
        return 1
    fi
    
    return 0
}

restart_backend() {
    log "Backend is down, restarting..."
    cd "$BACKEND_DIR"
    ./start-backend.sh
    sleep 5
    
    if check_backend; then
        log "Backend restarted successfully"
        return 0
    else
        log "Failed to restart backend"
        return 1
    fi
}

# Main monitoring loop
log "Backend monitor started"

while true; do
    if ! check_backend; then
        restart_backend
    else
        log "Backend is healthy"
    fi
    
    # Wait 30 seconds before next check
    sleep 30
done
















