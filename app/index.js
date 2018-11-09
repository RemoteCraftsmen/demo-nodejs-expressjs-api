require('babel-register');
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const bearerToken = require('express-bearer-token');

import config from '../config';

const app = express();

const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || '127.0.0.1';

import db from './models';
import { authRoutes, userRoutes, todoRoutes } from './routes';

db.sequelize
    .authenticate()
    .then(() => {
        console.log('Connection has been established successfully.');
    })
    .catch(err => {
        console.error('Unable to connect to the database:', err);
    });

var originsWhitelist = ['http://localhost:4200', config.frontendUrl];
var corsOptions = {
    origin: function(origin, callback) {
        if (originsWhitelist.includes(origin) || !origin) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true
};
app.use(cors(corsOptions));

app.use(bearerToken());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use('/auth', authRoutes);
app.use('/users', userRoutes);
app.use('/todos', todoRoutes);

module.exports = app.listen(PORT, HOST, () => {
    console.log(`express -> HOST: ${HOST} PORT: ${PORT}`);
});
