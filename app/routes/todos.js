const express = require('express');
const router = express.Router();

const VerifyToken = require('../middleware/VerifyToken');

const IndexController = require('../controllers/ToDo/IndexController');
const DestroyController = require('../controllers/ToDo/DestroyController');
const ShowController = require('../controllers/ToDo/ShowController');
const StoreController = require('../controllers/ToDo/StoreController');
const UpdateController = require('../controllers/ToDo/UpdateController');
const PatchController = require('../controllers/ToDo/PatchController');

const indexController = new IndexController();
const destroyController = new DestroyController();
const showController = new ShowController();
const storeController = new StoreController();
const updateController = new UpdateController();
const patchController = new PatchController();

router.post('/', VerifyToken, (...args) => storeController.invoke(...args));
router.get('/', VerifyToken, (...args) => indexController.invoke(...args));
router.get('/:id', VerifyToken, (...args) => showController.invoke(...args));
router.patch('/:id', VerifyToken, (...args) => patchController.invoke(...args));
router.put('/:id', VerifyToken, (...args) => updateController.invoke(...args));
router.delete('/:id', VerifyToken, (...args) =>
    destroyController.invoke(...args)
);

module.exports = router;
