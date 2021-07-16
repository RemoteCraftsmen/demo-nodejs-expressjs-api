const { query } = require('express-validator');

async function isInt(value) {
    if (isNaN(parseInt(value))) {
        return Promise.reject('should be integer');
    }
}

module.exports = [
    query('page')
        .optional()
        .custom(page => isInt(page)),
    query('perPage')
        .optional()
        .custom(perPage => isInt(perPage))
];
