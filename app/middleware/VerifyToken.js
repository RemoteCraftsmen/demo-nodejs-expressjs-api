const jwt = require('jsonwebtoken');
const env = process.env.NODE_ENV || 'development';
const config = require('../../config/config.json')[env];

function verifyToken(request, response, next) {
    const token = request.token || null;

    if (!token) {
        return response.status(403).json({ auth: false, message: 'No token provided.' });
    }

    jwt.verify(token, config.jwt.secret, function(err, decoded) {
        if (err) {
            return response.status(403).json({ auth: false, message: 'Failed to authenticate token.' });
        }

        request.logged_user_id = decoded.id;

        next();
    });
}

module.exports = verifyToken;
