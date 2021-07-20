const {
    app: { url }
} = require('../config');

module.exports = {
    openapi: '3.0.0',
    info: {
        title: 'Demo Todo app',
        version: '1.0.0',
        description: 'API documentation for Demo Todo app'
    },
    servers: [
        {
            url: url.includes('/api') ? url : `${url}/api`
        }
    ],
    components: {
        securitySchemes: {
            bearerAuth: {
                type: 'http',
                scheme: 'bearer',
                bearerFormat: 'JWT'
            }
        }
    }
};
