const { StatusCodes } = require('http-status-codes');

class UpdateController {
    constructor(todoRepository) {
        this.todoRepository = todoRepository;
    }

    async invoke(request, response) {
        const {
            loggedUserId,
            body: data,
            params: { id: todoId }
        } = request;

        if (!data.userId) {
            data.userId = loggedUserId;
        }

        const todo = await this.todoRepository.findById(todoId);

        if (!todo) {
            return response.sendStatus(StatusCodes.NOT_FOUND);
        }

        if (todo.userId !== loggedUserId) {
            return response.sendStatus(StatusCodes.FORBIDDEN);
        }

        await todo.update(data, { fields: ['name', 'userId', 'completed'] });

        const updatedTodo = await this.todoRepository.findById(todoId);

        return response.send(updatedTodo);
    }
}

module.exports = UpdateController;
