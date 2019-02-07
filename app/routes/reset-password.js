const express = require('express');
const router = express.Router();

const ResetPasswordController = require('../controllers/ResetPasswordController');
const changePasswordRequest = require('../requests/ChangePasswordRequest');
const ResetPasswordRequest = require('../requests/ResetPasswordRequest');

router.post('/', ResetPasswordRequest, ResetPasswordController.resetPassword);
router.post('/:token', changePasswordRequest, ResetPasswordController.changePassword);

module.exports = router;
