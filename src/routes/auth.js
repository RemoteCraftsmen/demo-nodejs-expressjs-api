const express = require('express');

const validate = require('../middleware/validate');
const authValidator = require('../validators/authValidator');
const userValidator = require('../validators/userValidator');
const changePasswordValidator = require('../validators/changePasswordValidator');
const resetPasswordValidator = require('../validators/resetPasswordValidator');

const router = express.Router();

module.exports = di => {
    const loginController = di.get('controllers.auth.loginController');
    const registerController = di.get('controllers.auth.registerController');
    const requestPasswordResetController = di.get(
        'controllers.auth.requestPasswordResetController'
    );
    const checkPasswordResetController = di.get(
        'controllers.auth.checkPasswordResetController'
    );

    router.post('/login', [authValidator.login, validate], (...args) =>
        loginController.invoke(...args)
    );
    router.post('/register', [userValidator.store, validate], (...args) =>
        registerController.invoke(...args)
    );
    router.post(
        '/reset-password',
        [resetPasswordValidator, validate],
        (...args) => requestPasswordResetController.invoke(...args)
    );
    router.post(
        '/reset-password/:passwordResetToken',
        [changePasswordValidator, validate],
        (...args) => checkPasswordResetController.invoke(...args)
    );

    return router;
};
