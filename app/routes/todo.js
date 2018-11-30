import TodoControllerClass from '../controllers/TodoController';
import VerifyToken from '../middleware/VerifyToken';

const express = require('express');
const router = express.Router();
const TodoController = new TodoControllerClass();

router.post('/', VerifyToken, TodoController.storeItem);
router.get('/', VerifyToken, TodoController.getCollection);
router.get('/:id', VerifyToken, TodoController.getItem);
router.patch('/:id', VerifyToken, TodoController.patchItem);
router.put('/:id', VerifyToken, TodoController.putItem);
router.delete('/:id', VerifyToken, TodoController.destroyItem);

module.exports = router;
