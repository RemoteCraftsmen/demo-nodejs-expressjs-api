const {body} = require('express-validator/check');

module.exports = [
    body('email')
        .exists()
        .withMessage('is required'),
];
