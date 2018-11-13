require('babel-register');

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const bearerToken = require('express-bearer-token');
const app = express();
const PORT = 3000;
const HOST = '127.0.0.1';

import { authRoutes, userRoutes, todoRoutes, passwordReset } from './routes';
import db from './models';

db.sequelize
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

app.use(cors());
app.options('*', cors());

app.use('/auth', authRoutes);
app.use('/users', userRoutes);
app.use('/todos', todoRoutes);
app.use('/', passwordReset);

module.exports = app.listen(PORT, HOST, () => {
    console.log(`express -> HOST: ${HOST} PORT: ${PORT}`);
});
