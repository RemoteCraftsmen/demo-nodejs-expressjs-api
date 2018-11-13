import PasswordResetControllerClass from '../controllers/PasswordResetController';
import changePasswordRequest from '../requests/ChangePasswordRequest';

const express = require('express');
const router = express.Router();
const PasswordResetController = new PasswordResetControllerClass();

router.post('/reset-password', PasswordResetController.resetPassword);
router.post('/reset-password/:token', changePasswordRequest, PasswordResetController.changePassword);

module.exports = router;
