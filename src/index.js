const express = require('express');
const bearerToken = require('express-bearer-token');
const helmet = require('helmet');
const path = require('path');

const app = express();

app.use(
    helmet({
        contentSecurityPolicy: false
    })
);

const di = require('./di');
app.set('di', di);

app.use(bearerToken());

const router = require('./routes')(di);
const errorHandler = require('./plugins/errorHandler');

require('./plugins/bodyParser')(app);

app.use('/swagger', express.static(path.join(__dirname, '../public/swagger')));
app.use('/', express.static(path.join(__dirname, '../public/api-doc')));

require('./plugins/cors')(app);

app.use(router);
app.use(errorHandler);

app.use((req, res, next) => {
    res.status(404).send('Not found!');
});

module.exports = app;
