const { body } = require('express-validator');

module.exports = [body('email').exists().withMessage('Email is required.')];
