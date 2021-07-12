const { validate } = require('uuid');

class isValidUuid {
    handle(uuid) {
        return validate(uuid);
    }
}

module.exports = isValidUuid;
