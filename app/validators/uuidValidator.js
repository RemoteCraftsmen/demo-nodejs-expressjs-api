const { param } = require('express-validator');
const { validate } = require('uuid');

async function isUUIDValid(id) {
    if (!validate(id)) {
        return Promise.reject('Id must be valid UUID');
    }
}

module.exports = [param('id').custom(id => isUUIDValid(id))];
