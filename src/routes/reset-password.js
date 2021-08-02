const express = require('express');
const router = express.Router();

const validate = require('../middleware/validate');
const changePasswordValidator = require('../validators/changePasswordValidator');
const resetPasswordValidator = require('../validators/resetPasswordValidator');

module.exports = di => {
    const requestPasswordResetController = di.get(
        'controllers.auth.requestPasswordResetController'
    );
    const checkPasswordResetController = di.get(
        'controllers.auth.checkPasswordResetController'
    );

    router.post('/', [resetPasswordValidator, validate], (...args) =>
        requestPasswordResetController.invoke(...args)
    );

    router.post(
        '/:passwordResetToken',
        [changePasswordValidator, validate],
        (...args) => checkPasswordResetController.invoke(...args)
    );

    return router;
};
