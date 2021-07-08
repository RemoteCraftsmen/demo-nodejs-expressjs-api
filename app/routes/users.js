const express = require('express');

const VerifyToken = require('../middleware/VerifyToken');

const validate = require('../middleware/validate');
const userValidator = require('../validators/userValidator');

const router = express.Router();

module.exports = di => {
    const indexController = di.get('controllers.users.indexController');
    const destroyController = di.get('controllers.users.destroyController');
    const showController = di.get('controllers.users.showController');
    const storeController = di.get('controllers.users.storeController');
    const updateController = di.get('controllers.users.updateController');

    router.post('/', [userValidator.store, validate], (...args) =>
        storeController.invoke(...args)
    );
    router.get('/', VerifyToken, (...args) => indexController.invoke(...args));
    router.get('/:id', VerifyToken, (...args) =>
        showController.invoke(...args)
    );
    router.put('/:id', VerifyToken, (...args) =>
        updateController.invoke(...args)
    );
    router.delete('/:id', VerifyToken, (...args) =>
        destroyController.invoke(...args)
    );

    return router;
};
