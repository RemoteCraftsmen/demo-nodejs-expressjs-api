const {
    app: { url }
} = require('./config');

module.exports = {
    openapi: '3.0.0',
    info: {
        title: 'Express Todo API',
        version: '1.0.0',
        description:
            '    Documentation for Simple Todo API with Express.js. App is using JWT, which provides authorization token. If user has logged, token is generated and is necessary to any other actions handle with VerifyToken middleware.'
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
