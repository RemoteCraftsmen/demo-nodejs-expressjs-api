const { StatusCodes } = require('http-status-codes');

const { Todo } = require('../../models');

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

    async invoke(request, response, next) {
        Todo.findAll({ where: { userId: request.loggedUserId } })
            .then(todos => {
                return response.json({ todos });
            })
            .catch(next);
    }
}

module.exports = IndexController;
