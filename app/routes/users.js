const express = require('express');
const router = express.Router();

const VerifyToken = require('../middleware/VerifyToken');

//const UserController = require('../controllers/UserController');

const IndexController = require('../controllers/User/IndexController');
const DestroyController = require('../controllers/User/DestroyController');
const ShowController = require('../controllers/User/ShowController');
const StoreController = require('../controllers/User/StoreController');
const UpdateController = require('../controllers/User/UpdateController');

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
