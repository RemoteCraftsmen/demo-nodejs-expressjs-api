/**
 * @param {{enableDocs: string}} config
 */
const config = require('../../config');

module.exports = (request, response, next) => {
    if (config.enableDocs) {
        return next();
    }

    return response.sendStatus(403);
};
