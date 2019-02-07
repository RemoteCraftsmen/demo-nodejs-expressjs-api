const express = require('express');
const router = express.Router();

const UserController = require('../controllers/UserController');
const VerifyToken = require('../middleware/VerifyToken');

router.post('/', UserController.storeItem);
router.get('/', VerifyToken, UserController.getCollection);
router.get('/:id', VerifyToken, UserController.getItem);
router.put('/:id', VerifyToken, UserController.putItem);
router.delete('/:id', VerifyToken, UserController.destroyItem);

module.exports = router;
