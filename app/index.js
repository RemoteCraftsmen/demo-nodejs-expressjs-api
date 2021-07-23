const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const bearerToken = require('express-bearer-token');
const helmet = require('helmet');
const path = require('path');

require('./plugins/wrapError');

const db = require('./models');

const sequelize = require('./util/database');

const toggleAPIDocs = require('./middleware/toggleAPIDocs');

const config = require('../config');
const di = require('./di');
const router = require('./routes')(di);

const errorHandler = require('./plugins/errorHandler');

const app = express();
const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || '127.0.0.1';
const ENV = process.env.NODE_ENV || 'development';

let localWhiteList = ['http://localhost:4200'];
let originsWhitelist = localWhiteList.concat(config.frontendUrls);
let corsOptions = {
    origin: (origin, callback) => {
        if (originsWhitelist.includes(origin) || !origin) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true
};

app.use(cors(corsOptions));
app.use(function (err, req, res, next) {
    if (err.message !== 'Not allowed by CORS') return next();
    res.send({ code: 200, message: 'Request not allowed by CORS' });
});
app.use(helmet());
app.use(bearerToken());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(router);
app.use(errorHandler);

app.set('di', di);

app.use('/swagger', express.static(path.join(__dirname, '../public/swagger')));

app.use((req, res, next) => {
    res.status(404).send('Not found!');
});

app.use((err, req, res, next) => {
    if (
        err.name === 'SequelizeValidationError' ||
        err.name === 'SequelizeUniqueConstraintError'
    ) {
        const errors = err.errors.map(e => {
            return { message: e.message, param: e.path };
        });

        return res.status(400).json({ errors });
    }

    if (err.message === 'Validation failed') {
        const errors = err.array().map(e => {
            return { message: e.msg, param: e.param };
        });

        return res.status(400).json({ errors });
    }

    console.error(err.stack);
    res.status(500).send('We messed something. Sorry!');
});

if (process.env.NODE_ENV !== 'test') {
    app.listen(PORT, HOST, () => {
        console.log(`environment: ${ENV}`);
        console.log(`express -> HOST: ${HOST} PORT: ${PORT}`);
    });
}

module.exports = app;
