const { body } = require('express-validator');

const login = [
    body('email')
        .not()
        .isEmpty()
        .withMessage('Should not be empty')
        .isEmail()
        .withMessage('Mail not valid'),

    body('password')
        .not()
        .isEmpty()
        .withMessage('Should not be empty')
        .isLength({ min: 8 })
        .withMessage('Password must have more than 8 characters')
];

module.exports = { login };
