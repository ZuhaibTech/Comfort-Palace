#!/bin/bash

# Bulletproof Watchdog Script for Inventory Artisans
# This script ensures maximum reliability and prevents crashes

LOG_FILE="/home/u300609276/backend/bulletproof-watchdog.log"
PM2_PATH="/home/u300609276/.nvm/versions/node/v18.20.8/bin/pm2"
BACKEND_DIR="/home/u300609276/backend"
PROCESS_NAME="inventory-artisans"
MAX_RESTART_ATTEMPTS=5
RESTART_COOLDOWN=60

# Function to log with timestamp
log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" | tee -a "$LOG_FILE"
}

# Function to check if backend is running and healthy
check_backend_health() {
    # Check if PM2 process is online
    if ! $PM2_PATH list | grep -q "$PROCESS_NAME.*online"; then
        return 1
    fi
    
    # Check if API is responding
    if ! curl -s -f --max-time 10 http://127.0.0.1:3001/api/health > /dev/null 2>&1; then
        log "WARNING: PM2 shows online but API not responding"
        return 1
    fi
    
    return 0
}

# Function to restart backend with exponential backoff
restart_backend() {
    local attempt=$1
    
    log "Restart attempt $attempt/$MAX_RESTART_ATTEMPTS"
    
    cd "$BACKEND_DIR"
    
    # Kill any existing processes
    $PM2_PATH delete "$PROCESS_NAME" 2>/dev/null || true
    sleep 2
    
    # Start with bulletproof config
    $PM2_PATH start ecosystem-bulletproof.config.js
    $PM2_PATH save
    
    # Wait for startup
    sleep 10
    
    # Verify it's working
    if check_backend_health; then
        log "Backend restarted successfully"
        return 0
    else
        log "Backend restart failed"
        return 1
    fi
}

# Function to perform health check
perform_health_check() {
    if check_backend_health; then
        log "Backend is healthy"
        return 0
    else
        log "Backend is unhealthy, attempting restart..."
        return 1
    fi
}

# Main watchdog loop
log "Bulletproof watchdog started"

restart_count=0
last_restart_time=0

while true; do
    current_time=$(date +%s)
    
    if ! perform_health_check; then
        # Check if we're in cooldown period
        if [ $((current_time - last_restart_time)) -lt $RESTART_COOLDOWN ]; then
            log "In cooldown period, waiting..."
            sleep 30
            continue
        fi
        
        # Reset restart count if it's been a while
        if [ $((current_time - last_restart_time)) -gt 300 ]; then
            restart_count=0
        fi
        
        # Check restart limit
        if [ $restart_count -ge $MAX_RESTART_ATTEMPTS ]; then
            log "ERROR: Max restart attempts reached, waiting 5 minutes before retry"
            sleep 300
            restart_count=0
            continue
        fi
        
        # Attempt restart
        restart_count=$((restart_count + 1))
        last_restart_time=$current_time
        
        if restart_backend $restart_count; then
            restart_count=0
        fi
    else
        # Reset restart count on successful health check
        restart_count=0
    fi
    
    # Wait before next check
    sleep 30
done
















