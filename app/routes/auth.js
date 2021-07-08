const express = require('express');

const validate = require('../middleware/validate');
const authValidator = require('../validators/authValidator');

const router = express.Router();

module.exports = di => {
    const loginController = di.get('controllers.auth.loginController');

    router.post('/login', [authValidator.login, validate], (...args) =>
        loginController.invoke(...args)
    );

    return router;
};
