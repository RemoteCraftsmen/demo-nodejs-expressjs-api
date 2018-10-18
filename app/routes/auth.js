import AuthControllerClass from '../controllers/AuthController';

const express = require('express');
const router = express.Router();
const AuthController = new AuthControllerClass();

router.post('/login', AuthController.login);

module.exports = router;
