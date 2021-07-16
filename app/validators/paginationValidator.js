const { query } = require('express-validator');

module.exports = [
    query('page')
        .optional()
        .custom(page => !isNaN(parseInt(page)))
        .withMessage('Should be integer!'),
    query('perPage')
        .optional()
        .custom(perPage => !isNaN(parseInt(perPage)))
        .withMessage('Should be integer!')
];
