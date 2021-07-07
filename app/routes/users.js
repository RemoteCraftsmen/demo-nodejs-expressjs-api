const express = require('express');
const router = express.Router();

const VerifyToken = require('../middleware/VerifyToken');

//const UserController = require('../controllers/UserController');

const IndexController = require('../controllers/Users/IndexController');
const DestroyController = require('../controllers/Users/DestroyController');
const ShowController = require('../controllers/Users/ShowController');
const StoreController = require('../controllers/Users/StoreController');
const UpdateController = require('../controllers/Users/UpdateController');

const indexController = new IndexController();
const destroyController = new DestroyController();
const showController = new ShowController();
const storeController = new StoreController();
const updateController = new UpdateController();

router.post('/', (...args) => storeController.invoke(...args));
router.get('/', VerifyToken, (...args) => indexController.invoke(...args));
router.get('/:id', VerifyToken, (...args) => showController.invoke(...args));
router.put('/:id', VerifyToken, (...args) => updateController.invoke(...args));
router.delete('/:id', VerifyToken, (...args) =>
    destroyController.invoke(...args)
);

module.exports = router;
