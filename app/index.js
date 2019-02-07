const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const bearerToken = require('express-bearer-token');
const helmet = require('helmet');

const db = require('./models');

const router = require('./routes');
const ToggleAPIDocs = require('./middleware/ToggleAPIDocs');

const config = require('../config');

const app = express();
const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || '127.0.0.1';
const ENV = process.env.NODE_ENV || 'development';

db.sequelize
    .authenticate()
    .then(() => {
        console.log('Connection has been established successfully.');
    })
    .catch(err => {
        console.error('Unable to connect to the database:', err);
    });

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
    res.status(200).json({code: 200, message: 'Request not allowed by CORS'});
});
app.use(helmet());
app.use(bearerToken());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.use(router);

app.use('/', ToggleAPIDocs, express.static('docs'));

app.use((req, res, next) => {
    res.status(404).send("Not found!");
});

app.use((err, req, res, next) => {
    if (err.name === 'SequelizeValidationError' || err.name === 'SequelizeUniqueConstraintError') {
        const errors = err.errors.map(e => {
            return {message: e.message, param: e.path};
        });

        return res.status(400).json({errors});
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
