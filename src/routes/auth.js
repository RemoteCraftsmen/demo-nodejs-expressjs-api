const express = require('express');

const validate = require('../middleware/validate');
const authValidator = require('../validators/authValidator');
const userValidator = require('../validators/userValidator');

const router = express.Router();

module.exports = di => {
    const loginController = di.get('controllers.auth.loginController');
    const registerController = di.get('controllers.auth.registerController');

    router.post('/login', [authValidator.login, validate], (...args) =>
        loginController.invoke(...args)
    );
    router.post('/register', [userValidator.store, validate], (...args) =>
        registerController.invoke(...args)
    );

    return router;
};
