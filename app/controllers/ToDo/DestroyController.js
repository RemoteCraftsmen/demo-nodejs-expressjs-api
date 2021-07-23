const { StatusCodes } = require('http-status-codes');

class DestroyController {
    constructor(todoRepository) {
        this.todoRepository = todoRepository;
    }

    async invoke(request, response) {
        const {
            loggedUserId,
            params: { id: todoId }
        } = request;

        const todo = await this.todoRepository.findById(todoId);

        if (!todo) {
            return response.sendStatus(StatusCodes.NO_CONTENT);
        }

        if (todo.userId !== loggedUserId) {
            return response.sendStatus(StatusCodes.FORBIDDEN);
        }

        await todo.destroy();

        response.sendStatus(StatusCodes.NO_CONTENT);
    }
}

module.exports = DestroyController;
