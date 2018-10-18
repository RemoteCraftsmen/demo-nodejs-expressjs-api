{
    "apps" : [
        {
            "name"        : "beta-fund-api",
            "script"      : "./build/index.js",
            "watch"       : false,
            "env_production" : {
                "NODE_ENV": "production",
                "PORT": "3000"
            }
        }
    ]
}
