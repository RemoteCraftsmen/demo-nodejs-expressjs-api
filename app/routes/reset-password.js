const express = require('express');
const router = express.Router();

const ResetPasswordController = require('../controllers/ResetPasswordController');
const changePasswordRequest = require('../requests/ChangePasswordRequest');

router.post('/', ResetPasswordController.resetPassword);
router.post('/:token', changePasswordRequest, ResetPasswordController.changePassword);

module.exports = router;
