const { Todo } = require('../models');
const HttpStatus = require('http-status-codes');

class TodoController {
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
    static getCollection(request, response, next) {
        Todo.findAll({ where: { userId: request.loggedUserId } })
            .then(todos => {
                return response.json({ todos });
            })
            .catch(next);
    }

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
    static storeItem(request, response, next) {
        const data = request.body;

        data.creatorId = request.loggedUserId;
        if (!data.userId) {
            data.userId = request.loggedUserId;
        }

        Todo.create({ ...data })
            .then(todo => {
                return response.status(HttpStatus.CREATED).json(todo);
            })
            .catch(next);
    }

    /**
     *  @api {post} /todos/:id Show ToDo element
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
    static getItem(request, response, next) {
        const todoId = request.params.id;

        Todo.findByPk(todoId)
            .then(todo => {
                if (!todo) {
                    return response.sendStatus(HttpStatus.NOT_FOUND);
                }

                return response.json(todo);
            })
            .catch(next);
    }

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
     * @apiSuccessExample {json} Succes : Creating new element - only when :id does not exist in table
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
     *  @apiError BadRequest    The <code>id</code> of the ToDo element was not found, <code>id</code> does not exist in table ToDo and parametr "name" is not specified
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
    static putItem(request, response, next) {
        const todoId = request.params.id;
        const fields = request.body;

        fields.creatorId = request.loggedUserId;
        if (!fields.userId) {
            fields.userId = request.loggedUserId;
        }

        Todo.findByPk(todoId).then(todo => {
            if (!todo) {
                return Todo.create({ ...fields, todoId })
                    .then(todo => {
                        return response.status(HttpStatus.CREATED).json(todo);
                    })
                    .catch(next);
            }

            if (todo.userId !== request.loggedUserId) {
                return response.sendStatus(HttpStatus.FORBIDDEN);
            }

            return todo
                .update(fields, { fields: ['name', 'userId'] })
                .then(() => {
                    return response.sendStatus(HttpStatus.OK);
                })
                .catch(next);
        });
    }

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
    static patchItem(request, response, next) {
        const todoId = request.params.id;
        const fields = request.body;

        Todo.findByPk(todoId).then(todo => {
            if (!todo) {
                return response.sendStatus(HttpStatus.NOT_FOUND);
            }

            if (todo.userId !== request.loggedUserId) {
                return response.sendStatus(HttpStatus.FORBIDDEN);
            }

            todo.update(fields, { fields: ['name', 'userId', 'completed'] })
                .then(() => {
                    response.sendStatus(HttpStatus.OK);
                })
                .catch(next);
        });
    }

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
    static destroyItem(request, response, next) {
        const todoId = request.params.id;

        Todo.findByPk(todoId).then(todo => {
            if (!todo) {
                return response.sendStatus(HttpStatus.NOT_FOUND);
            }

            if (todo.userId !== request.loggedUserId) {
                return response.sendStatus(HttpStatus.FORBIDDEN);
            }

            todo.destroy()
                .then(() => {
                    response.sendStatus(HttpStatus.NO_CONTENT);
                })
                .catch(next);
        });
    }
}

module.exports = TodoController;
