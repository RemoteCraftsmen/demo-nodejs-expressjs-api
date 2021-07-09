const { StatusCodes } = require('http-status-codes');

class UpdateController {
    /**
     *  @api {put} /todos/:id Update/Create {PUT} ToDo element
     *  @apiName PutToDoPut
     *  @apiGroup ToDo
     *  @apiVersion 1.0.0
     *
     *  @apiDescription With this method we can not only update elements, but also create them, depends on :id pamaretr.
     *  If :id already exist in db table we are updating, if not we are creating element
     *
     *  @apiParam {Number} id
     *  @apiParam {String} name
     *
     * @apiSuccessExample {json} Success : Creating new element - only when :id does not exist in table
     *     HTTP/1.1 201 OK
     *    {
     *        "completed": false,
     *        "id": 5,
     *        "name": "krarkakrkar",
     *        "creatorId": 6,
     *        "userId": 6,
     *        "updatedAt": "2018-11-27T12:38:16.210Z",
     *        "createdAt": "2018-11-27T12:38:16.210Z"
     *    }
     *
     *  @apiError BadRequest    The <code>id</code> of the ToDo element was not found, <code>id</code> does not exist in table ToDo and parameter "name" is not specified
     *  @apiError Forbidden     ToDo element belongs to other User
     *  @apiErrorExample Error-Response:
     *     HTTP/1.1 404 NotFound
     *
     *    {
     *        "errors": [
     *                {
     *                    "message": "cannot be blank",
     *                    "param": "name"
     *                }
     *            ]
     *    }
     */
    constructor(todoRepository) {
        this.todoRepository = todoRepository;
    }

    async invoke(request, response) {
        const {
            body: fields,
            params: { id: todoId }
        } = request;

        fields.creatorId = request.loggedUserId;

        if (!fields.userId) {
            fields.userId = request.loggedUserId;
        }

        const todo = await this.todoRepository.findById(todoId);

        if (!todo) {
            const newTodo = await this.todoRepository.create({
                ...fields,
                todoId
            });

            return response.status(StatusCodes.CREATED).send(newTodo);
        }

        if (todo.userId !== request.loggedUserId) {
            return response.sendStatus(StatusCodes.FORBIDDEN);
        }

        await todo.update(fields, { fields: ['name', 'userId'] });

        const updatedTodo = await this.todoRepository.findById(todoId);

        return response.send(updatedTodo);
    }
}

module.exports = UpdateController;
