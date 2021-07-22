const { StatusCodes } = require('http-status-codes');

class ShowController {
    constructor(todoRepository) {
        this.todoRepository = todoRepository;
    }

    async invoke(request, response) {
        const {
            loggedUserId,
            params: { id: todoId }
        } = request;

        const todo = await this.todoRepository.findById(todoId, {
            where: { userId: loggedUserId }
        });

        if (!todo) {
            return response.sendStatus(StatusCodes.NOT_FOUND);
        }

        return response.send(todo);
    }
}

module.exports = ShowController;
