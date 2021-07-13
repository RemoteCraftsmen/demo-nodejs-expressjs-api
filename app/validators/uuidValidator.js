const { param } = require('express-validator');
const { validate } = require('uuid');

async function isUUIDValid(uuid) {
    if (!validate(uuid)) {
        return Promise.reject('must be valid UUID');
    }
}

module.exports = arg => {
    return [param(arg).custom(uuid => isUUIDValid(uuid))];
};
