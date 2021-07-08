const { StatusCodes } = require('http-status-codes');

class ShowController {
    /**
     *  @api {get} /todos/:id Show ToDo element
     *  @apiName GetToDoShow
     *  @apiGroup ToDo
     *  @apiVersion 1.0.0
     *
     *  @apiParam {Number} id             ID of a ToDo List element
     *
     *
     *  @apiSuccessExample Success-Response:
     *     HTTP/1.1 200 OK
     *    {
     *        "id": 3,
     *        "userId": 6,
     *        "creatorId": 6,
     *        "name": "test",
     *        "completed": false,
     *        "createdAt": "2018-11-27T11:24:36.779Z",
     *        "updatedAt": "2018-11-27T11:24:36.779Z"
     *    }
     *
     *   @apiSuccess {Boolean}     completed
     *   @apiSuccess {Number}      id
     *   @apiSuccess {String}      name
     *   @apiSuccess {Number}      creatorId
     *   @apiSuccess {Number}      userId
     *   @apiSuccess {Timestamp}   updatedAt
     *   @apiSuccess {Timestamp}   createdAt
     *
     *   @apiError (404) Not Found    The <code>id</code> of the ToDo element was not found.
     */
    constructor(todoRepository) {
        this.todoRepository = todoRepository;
    }

    async invoke(request, response) {
        const {
            params: { id: todoId }
        } = request;

        const todo = await this.todoRepository.findOne({
            where: { id: todoId, userId: request.loggedUserId }
        });

        if (!todo) {
            return response.sendStatus(StatusCodes.NOT_FOUND);
        }

        return response.send(todo);
    }
}

module.exports = ShowController;
