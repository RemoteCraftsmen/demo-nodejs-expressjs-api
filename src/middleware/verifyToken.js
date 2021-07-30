const jwt = require('jsonwebtoken');
const { StatusCodes } = require('http-status-codes');

const config = require('../config');

module.exports = (request, response, next) => {
    const token = request.token || null;

    if (!token) {
        return response
            .status(StatusCodes.UNAUTHORIZED)
            .send({ message: 'No token provided.' });
    }

    jwt.verify(token, config.jwt.secret, (err, decoded) => {
        if (err) {
            return response.status(StatusCodes.UNAUTHORIZED).send({
                message: 'Failed to authenticate token.'
            });
        }

        request.loggedUserId = decoded.id;

        next();
    });
};
