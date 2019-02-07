const {body, param} = require('express-validator/check');

module.exports = [
    param('email')
        .exists()
        .withMessage('is required'),

    // body('frontendUrl')
    //     .exists()
    //     .withMessage('is required'),
];
