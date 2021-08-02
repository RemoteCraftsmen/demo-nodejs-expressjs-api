const cors = require('cors');
const config = require('../config');

module.exports = app => {
    let originsWhitelist = config.frontendUrls;

    let corsOptions = {
        origin: (origin, callback) => {
            if (originsWhitelist.includes(origin) || !origin) {
                callback(null, true);
            } else {
                callback(new Error('Not allowed by CORS'));
            }
        },
        credentials: true
    };

    app.use(cors(corsOptions));
};
