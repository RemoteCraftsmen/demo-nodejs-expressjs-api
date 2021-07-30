const cors = require('cors');
const config = require('../config');

module.exports = app => {
    let localWhiteList = ['http://localhost:4200'];
    let originsWhitelist = localWhiteList.concat(config.frontendUrls);

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
