const express = require('express');
const router = express.Router();

const changePasswordRequest = require('../validators/changePasswordValidator');
const resetPasswordRequest = require('../validators/resetPasswordValidator');

module.exports = di => {
    const resetPasswordController = di.get(
        'controllers.auth.resetPasswordController'
    );
    const changePasswordController = di.get(
        'controllers.auth.changePasswordController'
    );

    router.post('/', resetPasswordRequest, (...args) =>
        resetPasswordController.invoke(...args)
    );

    router.post('/:token', changePasswordRequest, (...args) =>
        changePasswordController.invoke(...args)
    );

    return router;
};
