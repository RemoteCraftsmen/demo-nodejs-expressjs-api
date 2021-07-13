const express = require('express');
const router = express.Router();

const VerifyToken = require('../middleware/VerifyToken');
const validate = require('../middleware/validate');
const todoValidator = require('../validators/todoValidator');
const uuidValidator = require('../validators/uuidValidator');

module.exports = di => {
    const indexController = di.get('controllers.todo.indexController');
    const destroyController = di.get('controllers.todo.destroyController');
    const showController = di.get('controllers.todo.showController');
    const storeController = di.get('controllers.todo.storeController');
    const updateController = di.get('controllers.todo.updateController');

    router.post('/', [todoValidator.create, validate], VerifyToken, (...args) =>
        storeController.invoke(...args)
    );
    router.get('/', VerifyToken, (...args) => indexController.invoke(...args));
    router.get('/:id', [uuidValidator.id, validate], VerifyToken, (...args) =>
        showController.invoke(...args)
    );
    router.put(
        '/:id',
        [todoValidator.create, uuidValidator.id, validate],
        VerifyToken,
        (...args) => updateController.invoke(...args)
    );
    router.delete(
        '/:id',
        [uuidValidator.id, validate],
        VerifyToken,
        (...args) => destroyController.invoke(...args)
    );

    return router;
};
