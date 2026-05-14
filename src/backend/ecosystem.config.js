// PM2 Ecosystem Configuration
// For production deployments on VPS/dedicated servers
// 
// Usage:
//   pm2 start ecosystem.config.js
//   pm2 save
//   pm2 startup

module.exports = {
  apps: [{
    name: 'inventory-artisans-api',
    script: './server.js',
    
    // Environment
    env: {
      NODE_ENV: 'production',
      PORT: 3001
    },
    
    // Instance configuration
    instances: 1,  // Set to 'max' to use all CPU cores
    exec_mode: 'fork', // Use 'cluster' if instances > 1
    
    // Auto-restart configuration
    autorestart: true,
    watch: false,  // Set to true for development only
    max_memory_restart: '500M',
    
    // Logging
    error_file: './logs/error.log',
    out_file: './logs/out.log',
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    merge_logs: true,
    
    // Advanced features
    min_uptime: '10s',
    max_restarts: 10,
    restart_delay: 4000,
    
    // Source map support
    source_map_support: true,
    
    // Wait for app to be ready
    listen_timeout: 3000,
    kill_timeout: 5000
  }]
};



