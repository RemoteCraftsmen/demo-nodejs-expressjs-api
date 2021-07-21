/**
 *  @api {get} /todos/:id Show ToDo element
 *  @apiName GetToDoShow
 *  @apiGroup ToDo
 *  @apiVersion 1.0.0
 *
 *  @apiParam {Uuid} id             ID of a ToDo List element
 *
 *
 *  @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *    {
 *        "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
 *        "userId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
 *        "creatorId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
 *        "name": "test",
 *        "completed": false,
 *        "createdAt": "2018-11-27T11:24:36.779Z",
 *        "updatedAt": "2018-11-27T11:24:36.779Z"
 *    }
 *
 *   @apiSuccess {Uuid}      id Id of todo item
 *   @apiSuccess {Boolean}     completed Is task completed
 *   @apiSuccess {String}      name Name of Todo item
 *   @apiSuccess {Uuid}      creatorId Id of user that created task
 *   @apiSuccess {Uuid}      userId Id of user(owner)
 *   @apiSuccess {Timestamp}   updatedAt  Date of last update
 *   @apiSuccess {Timestamp}   createdAt Creation date
 *
 *   @apiError (404) Not Found    The <code>id</code> of the ToDo element was not found.
 */
