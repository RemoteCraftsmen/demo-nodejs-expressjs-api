const app = require('../index');

const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || '127.0.0.1';
const ENV = process.env.NODE_ENV || 'development';

app.listen(PORT, HOST, () => {
    console.log(`environment: ${ENV}`);
    console.log(`express -> HOST: ${HOST} PORT: ${PORT}`);
});
