const express = require('express');

const validate = require('../middleware/validate');
const authValidator = require('../validators/authValidator');

const router = express.Router();

const LoginController = require('../controllers/Auth/LoginController');

const loginController = new LoginController();

router.post('/login', [authValidator.login, validate], (...args) =>
    loginController.invoke(...args)
);

module.exports = router;
