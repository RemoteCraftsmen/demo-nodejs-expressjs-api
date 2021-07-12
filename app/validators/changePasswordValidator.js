const { body, param } = require('express-validator');

module.exports = [
    param('passwordResetToken').exists().withMessage('is required'),

    body('password').exists().withMessage('is required'),

    body('passwordConfirmation')
        .exists()
        .withMessage('is required')
        .custom((value, { req }) => value === req.body.password)
        .withMessage('must match password')
];
