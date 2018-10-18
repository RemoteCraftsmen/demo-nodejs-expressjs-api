import TodoControllerClass from '../controllers/TodoController';
import VerifyToken from '../middleware/VerifyToken';

const express = require('express');
const router = express.Router();
const TodoController = new TodoControllerClass();

router.post('/', VerifyToken, TodoController.store);
router.get('/', VerifyToken, TodoController.index);
router.get('/:id', VerifyToken, TodoController.show);
router.patch('/:id', VerifyToken, TodoController.patch);
router.put('/:id', VerifyToken, TodoController.put);
router.delete('/:id', VerifyToken, TodoController.destroy);

module.exports = router;
