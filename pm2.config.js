require('dotenv').config();

const env = (key, defaultValue = null) => process.env[key] || defaultValue;

module.exports = {
    "apps": [
        {
            name: env('PM2_NAME', 'NodeExpress') + 'API',
            namespace: env('PM2_NAME', 'NodeExpressAPI'),
            "script": "./src/bin/server.js",
            "watch": false,
            "instances": "2",
            "exec_mode": "cluster",
            "env_production": {
                "NODE_ENV": "production"
            },
            "exp_backoff_restart_delay": 250,
            "max_restarts": 10,
            "min_uptime": 5000,
            "max_memory_restart": "150M",
            "log_date_format": "YYYY-MM-DD HH:mm"
        }
    ]
}
