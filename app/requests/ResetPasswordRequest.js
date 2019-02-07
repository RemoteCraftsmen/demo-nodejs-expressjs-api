const {body, param} = require('express-validator/check');

module.exports = [
    param('email')
        .exists()
        .withMessage('is required'),
];
