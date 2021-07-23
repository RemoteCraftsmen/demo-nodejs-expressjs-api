const { StatusCodes } = require('http-status-codes');

class StoreController {
    constructor(todoRepository) {
        this.todoRepository = todoRepository;
    }

    async invoke(request, response) {
        const { loggedUserId, body: data } = request;

        data.createdBy = loggedUserId;

        if (!data.userId) {
            data.userId = loggedUserId;
        }

        const todo = await this.todoRepository.create(data);

        return response.status(StatusCodes.CREATED).send(todo);
    }
}

module.exports = StoreController;
