const jwt = require('jsonwebtoken');
const config = require('../../config');

module.exports = (request, response, next) => {
    const token = request.token || null;

    if (!token) {
        return response
            .status(403)
            .json({ auth: false, message: 'No token provided.' });
    }

    jwt.verify(token, config.jwt.secret, (err, decoded) => {
        if (err) {
            return response
                .status(403)
                .json({
                    auth: false,
                    message: 'Failed to authenticate token.'
                });
        }

        request.loggedUserId = decoded.id;

        next();
    });
};
