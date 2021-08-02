const { param } = require('express-validator');
const { validate } = require('uuid');

function isUUIDValid(uuid) {
    if (!validate(uuid)) {
        return false;
    }

    return true;
}

module.exports = arg => {
    return [
        param(arg)
            .custom(uuid => isUUIDValid(uuid))
            .withMessage('Must be a valid UUID.')
    ];
};
