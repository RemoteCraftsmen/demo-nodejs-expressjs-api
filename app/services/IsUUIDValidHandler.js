const { validate } = require('uuid');

class IsUUIDValidHandler {
    handle(uuid) {
        return validate(uuid);
    }
}

module.exports = IsUUIDValidHandler;
