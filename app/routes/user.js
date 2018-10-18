import UserControllerClass from '../controllers/UserController';
import VerifyToken from '../middleware/VerifyToken';

const express = require('express');
const router = express.Router();
const UserController = new UserControllerClass();

router.post('/', UserController.store);
router.get('/', VerifyToken, UserController.index);
router.get('/:id', VerifyToken, UserController.show);
router.put('/:id', VerifyToken, UserController.update);
router.delete('/:id', VerifyToken, UserController.destroy);

module.exports = router;
