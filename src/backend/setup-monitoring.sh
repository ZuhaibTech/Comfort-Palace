#!/bin/bash

# Setup script to install monitoring for shared hosting
# This creates a cron job to keep the backend running

BACKEND_DIR="/home/u300609276/backend"
AUTO_MONITOR="$BACKEND_DIR/auto-monitor.sh"
START_SCRIPT="$BACKEND_DIR/start-backend.sh"

echo "Setting up backend monitoring for shared hosting..."

# Make scripts executable
chmod +x "$AUTO_MONITOR"
chmod +x "$START_SCRIPT"

# Create a simple restart script for cron
cat > "$BACKEND_DIR/cron-restart.sh" << 'EOF'
#!/bin/bash
cd /home/u300609276/backend

# Check if backend is running
if ! pgrep -f "node.*server.js" > /dev/null; then
    echo "$(date): Backend not running, starting..." >> restart.log
    nohup /home/u300609276/.nvm/versions/node/v18.20.8/bin/node server.js > backend.log 2>&1 &
else
    # Check if API is responding
    if ! curl -s http://127.0.0.1:3001/api/health > /dev/null; then
        echo "$(date): API not responding, restarting..." >> restart.log
        pkill -f "node.*server.js"
        sleep 2
        nohup /home/u300609276/.nvm/versions/node/v18.20.8/bin/node server.js > backend.log 2>&1 &
    fi
fi
EOF

chmod +x "$BACKEND_DIR/cron-restart.sh"

echo "Monitoring setup complete!"
echo ""
echo "To set up automatic monitoring, add this to your crontab:"
echo "*/5 * * * * /home/u300609276/backend/cron-restart.sh"
echo ""
echo "Or run the auto-monitor in background:"
echo "nohup $AUTO_MONITOR > /dev/null 2>&1 &"





