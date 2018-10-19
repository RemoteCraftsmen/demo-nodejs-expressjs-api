require('babel-register');
const express = require('express');
const bodyParser = require('body-parser');
const Sequelize = require('sequelize');
const bearerToken = require('express-bearer-token');
const env = process.env.NODE_ENV || 'development';
const config = require('../config/config.json')[env];
const app = express();
const PORT = 3000;
const HOST = '127.0.0.1';
const sequelize = new Sequelize(config.database, config.username, config.password, config);

import { authRoutes, userRoutes, todoRoutes } from './routes';

sequelize
    .authenticate()
    .then(() => {
        console.log('Connection has been established successfully.');
    })
    .catch(err => {
        console.error('Unable to connect to the database:', err);
    });

app.use(bearerToken());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use('/auth', authRoutes);
app.use('/users', userRoutes);
app.use('/todos', todoRoutes);

module.exports = app.listen(PORT, HOST, () => {
    console.log(`express -> HOST: ${HOST} PORT: ${PORT}`);
});
