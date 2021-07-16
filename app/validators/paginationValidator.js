const { query } = require('express-validator');

module.exports = [
    query('page')
        .optional()
        .custom(page => !isNaN(page))
        .withMessage('Should be integer!'),
    query('perPage')
        .optional()
        .custom(perPage => !isNaN(perPage))
        .withMessage('Should be integer!')
];
