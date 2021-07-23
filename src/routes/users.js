const express = require('express');

const verifyToken = require('../middleware/verifyToken');
const validate = require('../middleware/validate');
const userValidator = require('../validators/userValidator');
const uuidValidator = require('../validators/uuidValidator');
const paginationValidator = require('../validators/paginationValidator');

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
    router.get('/', [paginationValidator, validate], verifyToken, (...args) =>
        indexController.invoke(...args)
    );
    router.get(
        '/:id',
        [uuidValidator('id'), validate],
        verifyToken,
        (...args) => showController.invoke(...args)
    );
    router.put(
        '/:id',
        [uuidValidator('id'), userValidator.update, validate],
        verifyToken,
        (...args) => updateController.invoke(...args)
    );
    router.delete(
        '/:id',
        [uuidValidator('id'), validate],
        verifyToken,
        (...args) => destroyController.invoke(...args)
    );

    return router;
};
