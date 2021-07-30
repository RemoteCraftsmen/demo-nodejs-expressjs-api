const express = require('express');
const router = express.Router();

const verifyToken = require('../middleware/verifyToken');
const validate = require('../middleware/validate');
const todoValidator = require('../validators/todoValidator');
const uuidValidator = require('../validators/uuidValidator');
const paginationValidator = require('../validators/paginationValidator');

module.exports = di => {
    const indexController = di.get('controllers.todo.indexController');
    const destroyController = di.get('controllers.todo.destroyController');
    const showController = di.get('controllers.todo.showController');
    const storeController = di.get('controllers.todo.storeController');
    const updateController = di.get('controllers.todo.updateController');

    router.post('/', [todoValidator.create, validate], verifyToken, (...args) =>
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
        [uuidValidator('id'), todoValidator.create, validate],
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
