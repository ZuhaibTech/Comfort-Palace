#!/bin/bash

# Auto-monitor script for shared hosting
# This script will check and restart the backend every 5 minutes

LOG_FILE="/home/u300609276/backend/auto-monitor.log"
BACKEND_DIR="/home/u300609276/backend"
START_SCRIPT="$BACKEND_DIR/start-backend.sh"
API_HEALTH_URL="http://127.0.0.1:3001/api/health"

# Ensure log file exists
touch "$LOG_FILE"

log() {
    echo "$(date '+%Y-%m-%d %H:%M:%S') - $1" >> "$LOG_FILE"
}

check_backend() {
    # Check if backend process is running
    if pgrep -f "node.*server.js" > /dev/null; then
        # Check if API is responding
        if curl -s -o /dev/null -w "%{http_code}" "$API_HEALTH_URL" | grep -q "200"; then
            return 0
        else
            log "Backend process running but API not responding"
            return 1
        fi
    else
        log "Backend process not found"
        return 1
    fi
}

start_backend() {
    log "Starting backend..."
    cd "$BACKEND_DIR" || { log "ERROR: Failed to change to backend directory"; return 1; }
    
    # Kill any existing processes
    pkill -f "node.*server.js" 2>/dev/null
    sleep 2
    
    # Start backend
    nohup /home/u300609276/.nvm/versions/node/v18.20.8/bin/node server.js > backend.log 2>&1 &
    PID=$!
    
    sleep 5
    
    if ps -p $PID > /dev/null; then
        log "Backend started successfully with PID $PID"
        return 0
    else
        log "ERROR: Failed to start backend"
        return 1
    fi
}

# Main monitoring loop
log "Auto-monitor started"

while true; do
    if ! check_backend; then
        log "Backend is down, attempting restart..."
        start_backend
        
        # Wait a bit and check again
        sleep 10
        if check_backend; then
            log "Backend restarted successfully"
        else
            log "ERROR: Backend restart failed"
        fi
    else
        log "Backend is healthy"
    fi
    
    # Wait 5 minutes before next check
    sleep 300
done
















