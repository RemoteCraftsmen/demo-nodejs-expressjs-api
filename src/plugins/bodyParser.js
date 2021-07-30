const bodyParser = require('body-parser');

module.exports = app => {
    app.use(bodyParser.urlencoded({ extended: true, limit: '1mb' }));
    app.use(bodyParser.json());
};
