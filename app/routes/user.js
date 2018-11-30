import UserControllerClass from '../controllers/UserController';
import VerifyToken from '../middleware/VerifyToken';

const express = require('express');
const router = express.Router();
const UserController = new UserControllerClass();

router.post('/', UserController.storeItem);
router.get('/', VerifyToken, UserController.getCollection);
router.get('/:id', VerifyToken, UserController.getItem);
router.put('/:id', VerifyToken, UserController.putItem);
router.delete('/:id', VerifyToken, UserController.destroyItem);

module.exports = router;
