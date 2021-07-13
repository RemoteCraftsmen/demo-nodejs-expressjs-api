const { param } = require('express-validator');
const { validate } = require('uuid');

async function isUUIDValid(id) {
    if (!validate(id)) {
        return Promise.reject('Id must be valid UUID');
    }
}

const id = [param('id').custom(id => isUUIDValid(id))];

module.exports = { id };
