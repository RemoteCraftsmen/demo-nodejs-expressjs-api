const express = require('express');
const router = express.Router();

const validate = require('../middleware/validate');
const changePasswordValidator = require('../validators/changePasswordValidator');
const resetPasswordValidator = require('../validators/resetPasswordValidator');

module.exports = di => {
    const resetPasswordController = di.get(
        'controllers.auth.resetPasswordController'
    );
    const changePasswordController = di.get(
        'controllers.auth.changePasswordController'
    );

    router.post('/', [resetPasswordValidator, validate], (...args) =>
        resetPasswordController.invoke(...args)
    );

    router.post('/:token', [changePasswordValidator, validate], (...args) =>
        changePasswordController.invoke(...args)
    );

    return router;
};
