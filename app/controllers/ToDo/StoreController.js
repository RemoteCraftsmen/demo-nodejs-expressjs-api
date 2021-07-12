const { StatusCodes } = require('http-status-codes');

class StoreController {
    /**
     *  @api {post} /todos Create ToDo element
     *  @apiName PostToDoStore
     *  @apiGroup ToDo
     *  @apiVersion 1.0.0
     *
     *  @apiParam {String} name             Name of that element, task
     *
     *  @apiParamExample {json} Request-Example:
     *    {
     *    	"name" : "test"
     *    }
     *
     *  @apiSuccessExample Success-Response:
     *     HTTP/1.1 200 OK
     *    {
     *        "completed": false,
     *        "id": 1,
     *        "name": "test",
     *        "creatorId": 6,
     *        "userId": 6,
     *        "updatedAt": "2018-11-27T10:30:29.700Z",
     *        "createdAt": "2018-11-27T10:30:29.700Z"
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
     *   @apiErrorExample Error-Response:
     *     HTTP/1.1 400 Bad Request
     *    {
     *        "errors": [
     *            {
     *                "message": "cannot be blank",
     *                "param": "name"
     *            }
     *        ]
     *    }
     */
    constructor(todoRepository) {
        this.todoRepository = todoRepository;
    }

    async invoke(request, response) {
        const { body: data } = request;

        data.creatorId = request.loggedUserId;

        if (!data.userId) {
            data.userId = request.loggedUserId;
        }

        const todo = await this.todoRepository.create(data);

        return response.status(StatusCodes.CREATED).send(todo);
    }
}

module.exports = StoreController;
