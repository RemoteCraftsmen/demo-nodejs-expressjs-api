const { randomBytes } = require('crypto');

class PasswordResetTokenGeneratorHandler {
    handle() {
        return randomBytes(64).toString('hex');
    }
}

module.exports = PasswordResetTokenGeneratorHandler;
