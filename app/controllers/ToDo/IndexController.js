class IndexController {
    /**
     *  @api {get} /todos Read all ToDo elements
     *  @apiName GetToDoIndex
     *  @apiGroup ToDo
     *  @apiVersion 1.0.0
     *
     *  @apiSuccessExample Success-Response:
     *     HTTP/1.1 200 OK
     *    {
     *        "todos": [
     *            {
     *                "id": 1,
     *                "userId": 6,
     *                "creatorId": 6,
     *                "name": "test",
     *                "completed": false,
     *                "createdAt": "2018-11-27T10:30:29.700Z",
     *                "updatedAt": "2018-11-27T10:30:29.700Z"
     *            }
     *        ]
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
        const { page = 1, perPage = 20 } = request.query;

        const offset = (page - 1) * perPage;

        const todos = await this.todoRepository.findAndCountAll({
            where: { userId: request.loggedUserId },
            limit: perPage,
            offset
        });

        return response.send(todos);
    }
}

module.exports = IndexController;
