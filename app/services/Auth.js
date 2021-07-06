const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('../../config');

class Auth {
    static signIn(user) {
        return jwt.sign({ id: user.getDataValue('id') }, config.jwt.secret, {
            expiresIn: 60 * 60 * 24
        });
    }

    static comparePasswords(password, dbPassword) {
        return bcrypt.compareSync(password, dbPassword);
    }
}

module.exports = Auth;
