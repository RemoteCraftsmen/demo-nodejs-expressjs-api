const fs = require('fs');
const express = require('express');
const router = express.Router();

module.exports = di => {
    fs.readdirSync(__dirname).forEach(function (route) {
        route = route.split('.')[0];

        if (route === 'index') {
            return;
        }

        if (route === 'default') {
            return;
        }

        router.use(`/${route}`, require(`./${route}`)(di));
    });

    return router;
};
