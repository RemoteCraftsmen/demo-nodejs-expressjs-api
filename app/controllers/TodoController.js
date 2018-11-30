import {Todo} from '../models';

export default class TodoController {

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
     *                "user_id": 6,
     *                "creator_id": 6,
     *                "name": "test",
     *                "completed": false,
     *                "created_at": "2018-11-27T10:30:29.700Z",
     *                "updated_at": "2018-11-27T10:30:29.700Z"
     *            }
     *        ]
     *    }
     *
     *   @apiSuccess {Boolean}     completed 
     *   @apiSuccess {Number}      id        
     *   @apiSuccess {String}      name      
     *   @apiSuccess {Number}      creator_id
     *   @apiSuccess {Number}      user_id   
     *   @apiSuccess {Timestamp}   updated_at
     *   @apiSuccess {Timestamp}   created_at
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
    getCollection(request, response, next) {
        Todo.findAll({where: {user_id: request.logged_user_id}})
            .then(todos => {
                return response.json({todos});
            })
            .catch(error => {
                return response.sendStatus(400);
            });
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
     *        "creator_id": 6,
     *        "user_id": 6,
     *        "updated_at": "2018-11-27T10:30:29.700Z",
     *        "created_at": "2018-11-27T10:30:29.700Z"
     *    }
     *
     *   @apiSuccess {Boolean}     completed 
     *   @apiSuccess {Number}      id        
     *   @apiSuccess {String}      name      
     *   @apiSuccess {Number}      creator_id
     *   @apiSuccess {Number}      user_id   
     *   @apiSuccess {Timestamp}   updated_at
     *   @apiSuccess {Timestamp}   created_at
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
    storeItem(request, response, next) {
        const data = request.body;

        data.creator_id = request.logged_user_id;
        if (!data.user_id) {
            data.user_id = request.logged_user_id;
        }

        Todo.create({...data})
            .then(todo => {
                return response.status(201).json(todo);
            })
            .catch(err => {
                const errors = err.errors.map(e => {
                    return {message: e.message, param: e.path};
                });

                return response.status(400).json({errors});
            });
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
     *        "user_id": 6,
     *        "creator_id": 6,
     *        "name": "test",
     *        "completed": false,
     *        "created_at": "2018-11-27T11:24:36.779Z",
     *        "updated_at": "2018-11-27T11:24:36.779Z"
     *    }
     *
     *   @apiSuccess {Boolean}     completed 
     *   @apiSuccess {Number}      id        
     *   @apiSuccess {String}      name      
     *   @apiSuccess {Number}      creator_id
     *   @apiSuccess {Number}      user_id   
     *   @apiSuccess {Timestamp}   updated_at
     *   @apiSuccess {Timestamp}   created_at
     *
     *   @apiError (404) Not Found    The <code>id</code> of the ToDo element was not found.
     */
    getItem(request, response, next) {
        const todo_id = request.params.id;

        Todo.findByPk(todo_id)
            .then(todo => {
                if (!todo) {
                    return response.sendStatus(404);
                }

                return response.json(todo);
            })
            .catch(error => {
                return response.sendStatus(404);
            });
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
     *        "creator_id": 6,
     *        "user_id": 6,
     *        "updated_at": "2018-11-27T12:38:16.210Z",
     *        "created_at": "2018-11-27T12:38:16.210Z"
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
    putItem(request, response, next) {
        const todo_id = request.params.id;
        const fields = request.body;

        fields.creator_id = request.logged_user_id;
        if (!fields.user_id) {
            fields.user_id = request.logged_user_id;
        }

        Todo.findByPk(todo_id).then(todo => {
            if (!todo) {
                return Todo.create({...fields, todo_id})
                    .then(todo => {
                        return response.status(201).json(todo);
                    })
                    .catch(err => {
                        const errors = err.errors.map(e => {
                            return {message: e.message, param: e.path};
                        });

                        return response.status(400).json({errors});
                    });
            }

            if (todo.user_id !== request.logged_user_id) {
                return response.sendStatus(403);
            }

            return todo
                .update(fields, {fields: ['name', 'user_id']})
                .then(() => {
                    return response.sendStatus(200);
                })
                .catch(err => {
                    const errors = err.errors.map(e => {
                        return {message: e.message, param: e.path};
                    });

                    return response.status(400).json({errors});
                });
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
     *   	"user_id" : 10,
     *   	"completed": true
     *   }
     *
     *  @apiError BadRequest    The <code>id</code> of the ToDo element was not found, <code>id</code> does not exist in table ToDo and parametr "name" is not specified
     *  @apiError Forbidden     ToDo element belongs to other User
     */
    patchItem(request, response, next) {
        const todo_id = request.params.id;
        const fields = request.body;

        Todo.findByPk(todo_id).then(todo => {
            if (!todo) {
                return response.sendStatus(404);
            }

            if (todo.user_id !== request.logged_user_id) {
                return response.sendStatus(403);
            }

            todo.update(fields, {fields: ['name', 'user_id', 'completed']})
                .then(() => {
                    response.sendStatus(200);
                })
                .catch(error => {
                    response.sendStatus(400);
                });
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
    destroyItem(request, response, next) {
        const todo_id = request.params.id;

        Todo.findByPk(todo_id).then(todo => {
            if (!todo) {
                return response.sendStatus(404);
            }

            if (todo.user_id !== request.logged_user_id) {
                return response.sendStatus(403);
            }

            todo.destroy()
                .then(() => {
                    response.sendStatus(204);
                })
                .catch(error => {
                    response.sendStatus(400);
                });
        });
    }
}
