const { StatusCodes } = require('http-status-codes');

class PatchController {
    /**
     *  @api {patch} /todos/:id Update {PATCH} ToDo element / Change completed state
     *  @apiName PatchToDoPatch
     *  @apiGroup ToDo
     *  @apiVersion 1.0.0
     *
     *  @apiDescription Very similar to PUT Method. THe difference is that we can mark ToDo element as completed or not completed (change "completed" field in Table to true or false).
     *
     *  @apiParam {Number} id           ID of a ToDo List element
     *  @apiParam {String} name         New name of a ToDo List element. When updating existing element, this parameter is optional
     *
     *  @apiParamExample {json} Request-Example:
     *   {
     *   	"name" : "krarkakrkar11112",
     *   	"userId" : 10,
     *   	"completed": true
     *   }
     *
     *  @apiError BadRequest    The <code>id</code> of the ToDo element was not found, <code>id</code> does not exist in table ToDo and parameter "name" is not specified
     *  @apiError Forbidden     ToDo element belongs to other User
     */
    constructor(todoRepository) {
        this.todoRepository = todoRepository;
    }

    async invoke(request, response) {
        const {
            body: fields,
            params: { id: todoId }
        } = request;

        const todo = await this.todoRepository.findById(todoId);

        if (!todo) {
            return response.sendStatus(StatusCodes.NOT_FOUND);
        }

        if (todo.userId !== request.loggedUserId) {
            return response.sendStatus(StatusCodes.FORBIDDEN);
        }

        await todo.update(fields, { fields: ['name', 'userId', 'completed'] });

        const updatedTodo = await this.todoRepository.findById(todoId);

        return response.send(updatedTodo);
    }
}

module.exports = PatchController;
