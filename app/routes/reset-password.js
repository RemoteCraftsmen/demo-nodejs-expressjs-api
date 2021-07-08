const express = require('express');
const router = express.Router();

module.exports = di => {
    const ResetPasswordController = require('../controllers/ResetPasswordController');
    const ChangePasswordRequest = require('../requests/ChangePasswordRequest');
    const ResetPasswordRequest = require('../requests/ResetPasswordRequest');

    router.post(
        '/',
        ResetPasswordRequest,
        ResetPasswordController.resetPassword
    );
    router.post(
        '/:token',
        ChangePasswordRequest,
        ResetPasswordController.changePassword
    );

    return router;
};
