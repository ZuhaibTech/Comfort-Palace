module.exports = {
  apps: [{
    name: 'inventory-artisans',
    script: 'server.js',
    interpreter: '/home/u300609276/.nvm/versions/node/v18.20.8/bin/node',
    instances: 1,
    autorestart: true,
    restart_delay: 5000,
    max_restarts: 50,
    min_uptime: '10s',
    watch: false,
    max_memory_restart: '512M',
    kill_timeout: 10000,
    listen_timeout: 10000,
    env: {
      NODE_ENV: 'production',
      PORT: 3001
    },
    error_file: './logs/err.log',
    out_file: './logs/out.log',
    log_file: './logs/combined.log',
    time: true,
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z'
  }]
};
















