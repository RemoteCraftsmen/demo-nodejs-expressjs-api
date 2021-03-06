const { StatusCodes } = require('http-status-codes');

class DestroyController {
    /**
     *  @api {delete} /todos/:id Delete ToDo element
     *  @apiName DeleteToDoDestroy
     *  @apiGroup ToDo
     *  @apiVersion 1.0.0
     *
     *  @apiParam {Number} id             ID of a ToDo List element
     *
     *  @apiSuccessExample Success-Response:
     *     HTTP/1.1 204 Content
     *
     *   @apiError NotFound     The <code>id</code> of the ToDo element was not found.
     *   @apiError Forbidden    ToDo element belongs to other User
     *   @apiError BadRequest
     */
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
